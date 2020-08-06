import discord, collections

student_queue = collections.deque()

async def queue(message: discord.Message):
    student_queue.append(message.author)
    await message.channel.send("{0} has been added to queue!".format(message.author.display_name))

async def dequeue(message):
    if len(student_queue) == 0:
        
    student = student_queue.popleft()
    strmessage = ""
    strmessage += "{0} has been removed from queue!".format(student.display_name))
    if len(student_queue) == 0:
        strmessage
        await message.channel.send("The queue is now empty.")
    else:
        await message.channel.send("<@{0}>, it is your turn!".format(student_queue[0].id))

async def remove(message):
    try:
        student_queue.remove(message.author)
    except ValueError:
        await message.channel.send("<@{0}> is not in queue!".format(message.author.id))
        return
    await message.channel.send("<@{0}> has been removed from queue.".format(message.author.id))

async def list_queue(message):
    names = map(lambda student: student.display_name, student_queue)
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