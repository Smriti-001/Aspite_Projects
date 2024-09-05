const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
const configuration = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
};

// Start the call
startCallButton.onclick = async () => {
    try {
        // Get local video stream
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create peer connection
        peerConnection = new RTCPeerConnection(configuration);

        // Add local stream tracks to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Handle remote stream
        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Simulate signaling server (in real app, you'd use a server)
        const answer = await simulateSignalingServer(offer);
        await peerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error('Error starting call:', error);
    }
};

// End the call
endCallButton.onclick = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
};

async function simulateSignalingServer(offer) {
    // Simulate delay and answer creation
    return new Promise((resolve) => {
        setTimeout(async () => {
            const answer = new RTCSessionDescription({
                type: 'answer',
                sdp: offer.sdp
            });
            resolve(answer);
        }, 1000);
    });
}