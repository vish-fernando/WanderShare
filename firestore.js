(function () {
    let db = null;
    let storageRoot = null;
    let firestoreReady = false;
    let firestoreUnsub = null;
    let reportUnsub = null;

    function init() {
        if (!window.FIREBASE_READY || !window.firebase) return;
        try {
            db = window.firebase.firestore();
            firestoreReady = true;
            window.FIRESTORE_READY = true;
            if (typeof window.firebase.storage === 'function') {
                storageRoot = window.firebase.storage().ref();
            }
        } catch (err) {
            console.warn('WanderShare: Firestore not available - using local storage only.', err);
        }
    }

    function isReady() { return firestoreReady && db; }

    async function uploadImage(postId, index, dataUrl) {
        if (!storageRoot || !String(dataUrl || '').startsWith('data:')) return dataUrl;
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const ref = storageRoot.child('posts/' + postId + '/img_' + index + '.jpg');
            await ref.put(blob, { contentType: 'image/jpeg' });
            return await ref.getDownloadURL();
        } catch (err) {
            return dataUrl;
        }
    }

    async function savePost(post) {
        if (!isReady() || !post || !post.id) return false;
        if ((post.privacy || 'public') !== 'public') return false;
        try {
            const images = (Array.isArray(post.images) && post.images.length) ? post.images : [post.image];
            let image = images[0] || '';
            let imageList = images.slice();
            while (imageList.length > 1 && JSON.stringify({ i: image, is: imageList }).length > 850000) {
                imageList.pop();
            }
            if (imageList.length) image = imageList[0];
            const data = {
                id: post.id,
                title: post.title || '',
                destination: post.destination || '',
                country: post.country || '',
                region: post.region || 'World',
                author: post.author || 'Explorer',
                authorKey: post.authorKey || '',
                shortDesc: post.shortDesc || '',
                story: post.story || '',
                tags: Array.isArray(post.tags) ? post.tags : [],
                date: post.date || '',
                privacy: post.privacy || 'public',
                likes: post.likes || 0,
                rating: post.rating || 0,
                ratingCount: post.ratingCount || 0,
                image: image,
                images: imageList,
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('posts').doc(post.id).set(data, { merge: true });
            return true;
        } catch (err) {
            console.warn('WanderShare: Firestore save failed.', err);
            return false;
        }
    }

    async function deletePost(postId) {
        if (!isReady() || !postId) return;
        try {
            await db.collection('posts').doc(postId).delete();
        } catch (err) { }
        if (storageRoot) {
            try {
                const list = await storageRoot.child('posts/' + postId).listAll();
                await Promise.all((list.items || []).map(item => item.delete()));
            } catch (err) { }
        }
    }

    function toPost(doc) {
        const d = doc.data ? doc.data() : doc;
        const id = d.id || doc.id;
        return {
            id: id,
            title: d.title || '',
            destination: d.destination || '',
            country: d.country || '',
            region: d.region || 'World',
            author: d.author || 'Explorer',
            authorKey: d.authorKey || '',
            shortDesc: d.shortDesc || '',
            story: d.story || '',
            image: d.image || '',
            images: (Array.isArray(d.images) && d.images.length) ? d.images : (d.image ? [d.image] : []),
            tags: Array.isArray(d.tags) ? d.tags : [],
            date: d.date || '',
            privacy: d.privacy || 'public',
            likes: d.likes || 0,
            liked: false,
            reported: false,
            rating: d.rating || 0,
            ratingCount: d.ratingCount || 0
        };
    }

    async function updatePostLikes(postId, likes) {
        if (!isReady() || !postId) return;
        try {
            await db.collection('posts').doc(postId).update({ likes: likes || 0 });
        } catch (err) {
            console.warn('WanderShare: like sync failed.', err);
        }
    }

    async function loadCloudPosts() {
        if (!isReady()) return false;
        try {
            const snap = await db.collection('posts').orderBy('createdAt', 'desc').get();
            if (snap.empty) return false;
            const cloud = [];
            snap.forEach(doc => cloud.push(toPost(doc)));
            const ids = new Set(allPosts.map(p => p.id));
            cloud.forEach(p => { if (!ids.has(p.id)) allPosts.push(p); });
            allPosts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            if (typeof loadLikes === 'function') loadLikes();
            if (typeof refreshCurrentView === 'function') refreshCurrentView();
            return true;
        } catch (err) {
            console.warn('WanderShare: Firestore load failed.', err);
            return false;
        }
    }

    function subscribe() {
        if (!isReady() || firestoreUnsub) return;
        try {
            firestoreUnsub = db.collection('posts').onSnapshot(snap => {
                let changed = false;
                snap.docChanges().forEach(change => {
                    const id = change.doc.id;
                    if (change.type === 'added') {
                        if (!allPosts.some(p => p.id === id)) { allPosts.unshift(toPost(change.doc)); changed = true; }
                    } else if (change.type === 'modified') {
                        const idx = allPosts.findIndex(p => p.id === id);
                        if (idx >= 0) { allPosts[idx] = Object.assign({}, allPosts[idx], toPost(change.doc)); changed = true; }
                    } else if (change.type === 'removed') {
                        const before = allPosts.length;
                        allPosts = allPosts.filter(p => p.id !== id);
                        if (allPosts.length !== before) changed = true;
                    }
                });
                if (changed) {
                    allPosts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                    if (typeof loadLikes === 'function') loadLikes();
                    if (typeof refreshCurrentView === 'function') refreshCurrentView();
                }
            });
        } catch (err) {
            console.warn('WanderShare: Firestore subscribe failed.', err);
        }
    }

    async function syncLocalPosts() {
        if (!isReady()) return;
        try {
            let localPublic = [];
            try {
                const saved = localStorage.getItem('wandershare_posts');
                const stored = saved ? JSON.parse(saved) : [];
                localPublic = stored.filter(p => (p.privacy || 'public') === 'public' && !String(p.id).startsWith('sample-'));
            } catch { }
            const snap = await db.collection('posts').get();
            const cloudIds = new Set();
            snap.forEach(doc => cloudIds.add(doc.id));
            let changed = false;
            for (const post of localPublic) {
                if (!cloudIds.has(post.id)) {
                    const ok = await savePost(post);
                    if (ok) changed = true;
                }
            }
            if (changed && localPublic.length) {
                try {
                    const stored = JSON.parse(localStorage.getItem('wandershare_posts') || '[]');
                    const keep = stored.filter(p => (p.privacy || 'public') !== 'public' || String(p.id).startsWith('sample-'));
                    localStorage.setItem('wandershare_posts', JSON.stringify(keep));
                } catch { }
            }
        } catch (err) {
            console.warn('WanderShare: Firestore sync failed.', err);
        }
    }

    async function saveReport(report) {
        if (!isReady() || !report || !report.postId) return false;
        try {
            await db.collection('reports').doc(report.id || ('report-' + report.postId)).set({
                id: report.id || ('report-' + report.postId),
                postId: report.postId,
                postTitle: report.postTitle || '',
                reporter: report.reporter || '',
                date: report.date || '',
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (err) {
            console.warn('WanderShare: report save failed.', err);
            return false;
        }
    }

    async function clearReports(postId) {
        if (!isReady() || !postId) return;
        try {
            const snap = await db.collection('reports').where('postId', '==', postId).get();
            const batch = db.batch();
            snap.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        } catch (err) { }
    }

    function subscribeReports() {
        if (!isReady() || reportUnsub) return;
        try {
            reportUnsub = db.collection('reports').onSnapshot(snap => {
                const cloud = [];
                snap.forEach(doc => {
                    const d = doc.data ? doc.data() : doc;
                    cloud.push({
                        id: d.id || doc.id,
                        postId: d.postId || '',
                        postTitle: d.postTitle || '',
                        reporter: d.reporter || '',
                        date: d.date || ''
                    });
                });
                if (typeof window.mergeCloudReports === 'function') {
                    window.mergeCloudReports(cloud);
                }
            });
        } catch (err) {
            console.warn('WanderShare: report subscribe failed.', err);
        }
    }

    async function saveDisplayName(userKey, name) {
        if (!isReady() || !userKey) return false;
        try {
            const data = {
                displayName: String(name || '').trim().slice(0, 60),
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            };
            if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
                data.email = String(currentUser.email).trim().toLowerCase();
            }
            await db.collection('users').doc(userKey).set(data, { merge: true });
            return true;
        } catch (err) {
            console.warn('WanderShare: display name save failed.', err);
            return false;
        }
    }

    async function saveUserEmail(userKey, email, name) {
        if (!isReady() || !userKey || !email) return false;
        try {
            await db.collection('users').doc(userKey).set({
                email: String(email).trim().toLowerCase(),
                displayName: String(name || '').trim().slice(0, 60),
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (err) {
            console.warn('WanderShare: user email save failed.', err);
            return false;
        }
    }

    async function listUsers() {
        if (!isReady()) return [];
        try {
            const snap = await db.collection('users').get();
            const users = [];
            snap.forEach(doc => {
                const d = doc.data ? doc.data() : doc;
                users.push({
                    uid: doc.id,
                    email: String(d.email || ''),
                    displayName: String(d.displayName || '')
                });
            });
            users.sort((a, b) => String(a.email || '').localeCompare(String(b.email || '')));
            return users;
        } catch (err) {
            console.warn('WanderShare: list users failed.', err);
            return [];
        }
    }

    async function loadDisplayName(userKey) {
        if (!isReady() || !userKey) return '';
        try {
            const snap = await db.collection('users').doc(userKey).get();
            if (snap.exists) {
                const d = snap.data ? snap.data() : snap;
                return String(d.displayName || '').trim().slice(0, 60);
            }
        } catch (err) {
            console.warn('WanderShare: display name load failed.', err);
        }
        return '';
    }

    async function saveMessage(message) {
        if (!isReady() || !message || !message.toUid) return false;
        try {
            const data = {
                toUid: message.toUid || '',
                toName: message.toName || '',
                fromUid: message.fromUid || '',
                fromName: message.fromName || '',
                text: String(message.text || '').trim().slice(0, 1000),
                type: message.type || 'admin',
                read: false,
                date: new Date().toISOString(),
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('messages').add(data);
            return true;
        } catch (err) {
            console.warn('WanderShare: message save failed.', err);
            return false;
        }
    }

    async function loadMessages(uid) {
        if (!isReady() || !uid) return [];
        try {
            const snap = await db.collection('messages').where('toUid', '==', uid).limit(200).get();
            const list = [];
            snap.forEach(doc => {
                const d = doc.data ? doc.data() : doc;
                list.push({
                    id: doc.id,
                    toUid: d.toUid || '',
                    toName: d.toName || '',
                    fromUid: d.fromUid || '',
                    fromName: d.fromName || '',
                    text: d.text || '',
                    type: d.type || 'admin',
                    read: !!d.read,
                    date: d.date || ''
                });
            });
            list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            return list;
        } catch (err) {
            console.warn('WanderShare: messages load failed.', err);
            return [];
        }
    }

    async function markMessageRead(messageId) {
        if (!isReady() || !messageId) return;
        try {
            await db.collection('messages').doc(messageId).update({ read: true });
        } catch (err) { }
    }

    function start() {
        init();
        if (!isReady()) return;
        loadCloudPosts().then(() => { syncLocalPosts(); });
        subscribe();
        subscribeReports();
    }

    window.initFirestoreSync = init;
    window.startFirestoreSync = start;
    window.savePostToFirestore = savePost;
    window.deletePostFromFirestore = deletePost;
    window.loadFirestorePosts = loadCloudPosts;
    window.subscribeFirestorePosts = subscribe;
    window.syncLocalPostsToFirestore = syncLocalPosts;
    window.saveReportToFirestore = saveReport;
    window.clearReportsFromFirestore = clearReports;
    window.updatePostLikesToFirestore = updatePostLikes;
    window.saveDisplayNameToFirestore = saveDisplayName;
    window.loadDisplayNameFromFirestore = loadDisplayName;
    window.saveUserEmailToFirestore = saveUserEmail;
    window.listUsersFromFirestore = listUsers;
    window.saveMessageToFirestore = saveMessage;
    window.loadMessagesFromFirestore = loadMessages;
    window.markMessageReadInFirestore = markMessageRead;
})();
