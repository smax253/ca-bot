jest.mock('../locale/commands', () => {
    return {
        prefix: '$',
        commands: {
            q: 'queue',
            queue: 'queue',
            dequeue: 'dequeue',
            d: 'dequeue',
            remove: 'remove',
            r: 'remove',
            list: 'list',
            status: 'status',
        },
    };
});

const generateHelpCommand = require('./generate_help_command');

describe('LOCALE: generate help command', () => {
    let result;
    beforeEach(() => {
        result = generateHelpCommand();
    });
    it('creates a help message based on the config', () => {
        expect(result).toEqual(
            `List of commands:
(All commands are specific to an office hours group)
$q,$queue: enters yourself into the queue to get help.
$remove,$r: removes yourself from the queue.
$status: gets your position in the queue.
$list: lists the current queue.
[admin-only commands]:
$dequeue,$d: removes the first person from the queue.`,
        );
    });
});
