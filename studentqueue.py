import collections

student_queue = collections.deque()

class QueueEntry(object):
    def __init__(self, author, is_private=False):
        self.author = author
        self.is_private = is_private

    def __str__(self):
        message = self.author.display_name
        if self.is_private:
            message += ' (private)'
        return message

    def __eq__(self, other):
        return self.author == other.author

    def display_name(self):
        return self.author.display_name

    def id(self):
        return self.author.id

    def toggle_private(self):
        self.is_private = not self.is_private

async def queue(message):
    if QueueEntry(message.author) in student_queue:
        await message.channel.send("You are already in queue!")
        return
    args = message.content.split(' ')
    if len(args) > 1 and args[1] == 'private':
        student_queue.append(QueueEntry(message.author, is_private=True))
    else:
        student_queue.append(QueueEntry(message.author))
    await message.channel.send("{0} has been added to queue!".format(message.author.display_name))


async def dequeue(message):
    if len(student_queue) == 0:
        await message.channel.send("There was no one in queue!")
        return
    student_queue.popleft()
    if len(student_queue) == 0:
        await message.channel.send("The queue is now empty.")
    else:
        await message.channel.send("<@{0}>, it is your turn!".format(student_queue[0].id()))


async def remove(message):
    try:
        student_queue.remove(QueueEntry(message.author))
    except ValueError:
        await message.channel.send("<@{0}> is not in queue!".format(message.author.id))
        return
    await message.channel.send("<@{0}> has been removed from queue.".format(message.author.id))


async def list_queue(message):
    if len(student_queue) == 0:
        await message.channel.send("The queue is empty!")
        return
    names = map(lambda student: str(student), student_queue)
    strmessage = "\nQueue:\n"
    for ind, name in enumerate(names):
        strmessage += "{0}. {1}\n".format(ind+1, name)
    await message.channel.send(strmessage)


async def status(message):
    strmessage = ""
    try:
        ind = student_queue.index(message.author)
        strmessage = "<@{0}>, you are #{1} in queue.".format(message.author.id, ind+1)
    except ValueError:
        strmessage = "<@{0}>, you are not in queue. ".format(message.author.id)
    await message.channel.send(strmessage)