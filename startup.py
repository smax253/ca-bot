import discord
from dotenv import load_dotenv
import os
import studentqueue, createoffice

load_dotenv()

ADMIN_ROLE = 'Course Assistant'
client = discord.Client()
HELP_MESSAGE = "Welcome to the Course Assistant Bot!"

@client.event
async def on_ready():
    print("logged in as ${0.user}".format(client))

@client.event
async def on_message(message:discord.Message):
    if message.author == client.user:
        return
    if message.content.startswith('!hello'):
        await message.channel.send('Hello!')
    if message.content == '!queue' or message.content == '!q':
        await studentqueue.queue(message)
    if message.content == '!dequeue' or message.content == '!d' or message.content == '!done':
        if ADMIN_ROLE in map(lambda x: x.name, message.author.roles):
            studentqueue.dequeue(message)
        else:
            studentqueue.remove(message)
    if message.content == '!list' or message.content == '!l':
        await studentqueue.list_queue(message)
    if message.content == '!help' or message.content == '!h':
        await message.channel.send(HELP_MESSAGE)
    if message.content == '!status' or message.content == '!s':
        await studentqueue.status(message)
    if message.content.startswith('!createRoom'):
        await createoffice.createOffice(message)

if __name__ == "__main__":
    client.run(os.getenv('DISCORD_BOT_KEY'))
    print('hello')
