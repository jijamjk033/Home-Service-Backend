// socket.on('newOrder', async (data) => {
//     const { senderId, senderModel, recipientId, recipientModel, orderDetails } = data;
//     const message = `New order received: ${orderDetails}`;
//     try {
//         await notificationRepository.createNotification(senderId, senderModel, recipientId, recipientModel, message, 'booking');
//         io.to(recipientId).emit('notification', { message, type: 'booking' });
//     } catch (error) {
//         console.error('Error saving new order notification:', error);
//         socket.emit('error', 'Could not save new order notification');
//     }
// });

// socket.on('orderCancelled', async (data) => {
//     const { senderId, senderModel, recipientId, recipientModel, orderId } = data;
//     const message = `Order #${orderId} was cancelled.`;
//     try {
//         await notificationRepository.createNotification(senderId, senderModel, recipientId, recipientModel, message, 'cancellation');
//         io.to(recipientId).emit('notification', { message, type: 'cancellation' });
//     } catch (error) {
//         console.error('Error saving order cancellation notification:', error);
//         socket.emit('error', 'Could not save order cancellation notification');
//     }
// });