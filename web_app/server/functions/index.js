'use strict';

const express = require('express');
const cors = require('cors')({
    origin: true
});
const app = express();
app.use(cors);

// const path = require('path');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const moment = require('moment');
const firebaseApp = admin.initializeApp();
const db = firebaseApp.database();

// Gets a list of emotions from our emotions node in Firebase
const getEmotionLabels = () => {
    return db.ref('emotions').orderByKey().once('value')
        .then(snapshot => {
            const promises = [];
            snapshot.forEach((snap) => {
                promises.push(snap.key);
            });
            return Promise.all(promises);
        }, err => {
            console.log('getEmotionLabels error', err);
            // res.status(500).send(err);
        })
        .catch(error => {
            console.log(error)
        });
}

const getEmotionsDataJSON = () => {
    return db.ref('emotions').orderByKey().once('value')
        .then((snapshot) => {
            return snapshot.toJSON();
        })
        .catch(error => {
            console.log('Could not retrieve emotions data', error)
        });
}

const randomEmotion = () => {
    const emotionTypes = ['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise', 'disgust'];
    return emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
};

const postEvent = (emotionId) => {
    // if (emotionId === null) {
    //     emotionId = randomEmotion();
    // }
    const certaintyVal = Math.random();
    const formattedDate = moment().format("YYYY-MM-DD H:m:s");
    const newPushKey = db.ref().child('events').push().key;
    console.log(`New event of type ${emotionId} with key ${newPushKey} written to database at ${formattedDate}`);
    const eventData = {
        emotion: emotionId,
        certainty: certaintyVal,
        timestamp: formattedDate
    };
    const emotionData = {
        certainty: certaintyVal,
        timestamp: formattedDate
    };
    const updates = {};
    updates['/events/' + newPushKey] = eventData;
    updates['/emotions/' + emotionId + '/' + newPushKey] = emotionData;
    return db.ref().update(updates)
        .then(() => {
            console.log('updates are: ', updates);
            return updates;
        })
        .catch((error) => console.log('Failed to write to database: ', error))
};

// public => cache on server, private => cache on user's browser
// max-age = sec => how long we can store this content in the user's browser
// s-max-age = sec => how long we can store this on the cdn
// app.post('/postEvent', async (req, res) => {
//     // const emotionId = req.params.emotionId;
//     // console.log('emotionId is:', emotionId);
//     // console.log('req is: ', req);
//     const emotionId = randomEmotion();
//     res.send(emotionId);
//     try {
//         const submission = await postEvent(emotionId);
//         res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
//         res.json(submission);
//     } catch (error) {
//         console.log('Error attempting to write event')
//         res.sendStatus(500);
//     }
// });
// app.get('/getEmotionsJSON', async (req, res) => {
//     try {
//         const query = await getEmotionsDataJSON();
//         res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
//         res.status(200).json(query);
//     } catch (error) {
//         console.log('Error getting emotions data: ', error);
//         res.sendStatus(500);
//     }
// });
// Expost the API as a function
// exports.api = functions.https.onRequest(app)
exports.getEmotionsDataJSON = functions.https.onRequest(async (req, res) => {
    const emotionsDataJSON = await getEmotionsDataJSON();
    res.json(emotionsDataJSON);
});
// exports.getEmotionLabels = functions.https.onCall((data, context) => {
//     try {
//         if (data === 'edd') {
//             db.ref('emotions').orderByKey().once('value')
//                 .then(snapshot => {
//                     const promises = [];
//                     snapshot.forEach((snap) => {
//                         promises.push(snap.key);
//                     });
//                     return Promise.all(promises);
//                 })
//                 .catch(error => {
//                     console.log('failed to return emotion labels', error);
//                 })

//         } else {
//             console.log('returning null');
//             return null;
//         }
//     } catch (error) {
//         console.log('getEmotionsLabels failed: ', error)
//     }
// })
// exports.getEmotionLabels = functions.https.onRequest((req, res) => {
//     res.set('Cache-Control', 'public, max-age=600, s-max-age=3600');
//     db.ref('emotions').orderByKey().once('value')
//         .then(snapshot => {
//             const promises = [];
//             snapshot.forEach((snap) => {
//                 promises.push(snap.key);
//             });
//             return Promise.all(promises)
//         }, err => {
//             console.log('getEmotionLabels error', err);
//             res.status(500).send(err);
//         })
//         .then(results => {
//             res.send(results);
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(500).send(error);
//         });
// });
const removeEventByKey = (key) => {
    if (key === null) {
        throw new Error('Error: invalid or null key used.');
    }
    return db.ref('event').child(key).remove()
        .then(() => console.log(`Event ${key} removed.`))
        .catch(error => {
            console.log(`removeEventByKey: removing event ${key} failed: `, error);
        })
}

const setCount = (newCount, path) => {
    if (newCount === null) {
        throw new Error("setCount: not called with a number");
    } else if (path === null) {
        throw new Error("setCount: not called with a string");
    }
    return db.ref('counts').child(path).set({
            count: newCount
        })
        .then(() => console.log(`setCount: ${path} count now set to ${newCount}`))
        .catch(error => console.log('setCount failed: ', error))
}
exports.addEvent = functions.https.onRequest(async (req, res) => {
    const emotionId = randomEmotion();
    console.log('random emotion selected is: ', emotionId);
    // res.send(emotionId);
    try {
        const submission = await postEvent(emotionId);
        res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
        res.json(submission);
    } catch (error) {
        console.log('Error attempting to write event')
        res.sendStatus(500);
    }
})
exports.addCount = functions.database.ref('emotions/{emotionId}/{emotionKey}')
    .onCreate((_, context) => {
        const emotionId = context.params.emotionId;
        const countsRef = db.ref('counts').child(emotionId).child('count');
        return countsRef.transaction(count => {
                return count + 1
            })
            .then((snap) => {
                return console.log(`addCount committed = ${snap.committed}`)
            })
            .catch((error) => {
                console.log('addCount failed: ', error);
                console.log('Warning: Did you call set on the same reference?')
            })
    })
exports.refreshCount = functions.database.ref('emotions/{emotionId}/{emotionKey}')
    .onDelete((snapshot, context) => {
        const emotionId = context.params.emotionId;
        const emotionKey = context.params.emotionKey;
        const emotionsRef = snapshot.ref.parent.parent;
        const eventsRef = db.ref('events');

        // Deleting emotion from /emotions/{emotionId}/emotion
        // also removes same data object from /events
        const p1 = eventsRef.once('value')
            .then((eventsSnapshot) => {
                if (eventsSnapshot.hasChild(emotionKey)) {
                    const eventId = emotionKey;
                    // console.log('eventId is: ', eventId);
                    return removeEventByKey(eventId)
                } else {
                    return console.log('No event item to delete');
                }
            })
            .catch(error => {
                console.log(error)
            })

        // Return updated count of child nodes for each emotion path
        const p2 = emotionsRef.child(emotionId).once('value')
            .then((emotionsData) => {
                const newCount = emotionsData.numChildren()
                // console.log('newCount is: ', newCount);
                return setCount(newCount, emotionId)
            })
            .catch(error => {
                console.log(error);
            })
        const promises = [p1, p2];
        return Promise.all(promises)
    })