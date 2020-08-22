const messages = {
    UNKNOWN_COMMAND: 'Sorry, command unrecognized. Please try again.',
    INITIALIZATION_SUCCESS: 'Server initialized successfully!',
    INITIALIZATION_ALREADY_EXISTS: 'Server has already been initalized!',
    QUEUE_ALREADY_QUEUED: 'You are already in queue.',
    QUEUE_SUCCESS: 'You have been queued!',
    DEQUEUE_SUCCESS: 'You have been dequeued!',
    DEQUEUE_EMPTY: 'The queue is empty.',
    REMOVE_SUCCESS: 'You have been removed from queue!',
    REMOVE_NOT_FOUND: 'You are not in queue!',
    NOT_AUTHORIZED: 'You are not authorized to do this command!',
    ADMIN_ADDED: 'Role has been successfully added as admin role.',
    ADMIN_ALREADY_ADDED: 'Role is already an admin!',
    ADMIN_REMOVED: 'Role has been successfully removed from admin roles.',
    ADMIN_NOT_FOUND: 'Role is not an admin role.',
};
module.exports = messages;
