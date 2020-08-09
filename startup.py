import os

import discord
from dotenv import load_dotenv

import createoffice
import database
import studentqueue

load_dotenv()

ADMIN_ROLE = 'Course Assistant'
client = discord.Client()
HELP_MESSAGE = "Welcome to the Course Assistant Bot!"


def command_match(message: discord.Message, *commands):
    return message.content.split(' ')[0] in commands


def is_admin(message):
    return message.author == message.guild.owner or ADMIN_ROLE in map(lambda x: x.name, message.author.roles)


@client.event
async def on_ready():
    print("logged in as ${0.user}".format(client))

@client.event
async def on_message(message: discord.Message):
    if message.author == client.user:
        return
    if command_match(message, '!init'):
        if is_admin(message):
            await createoffice.initialize(client, message)
            return
        else:
            await message.channel.send("You do not have the permission to do this!")
            return
    if not database.contains(message.channel.guild.id):
        await message.channel.send("Server not recognized, initialize server with !init")
        return
    if command_match(message, '!addadminrole'):
        if is_admin(message):
            await createoffice.add_admin(client, message)
        else:
            await message.channel.send("You do not have the permission to do this!")
    if command_match(message, '!hello'):
        await message.channel.send('Hello!')
    if command_match(message, '!queue', '!q'):
        await studentqueue.queue(message)
    if command_match(message, '!dequeue', '!d', '!done'):
        if is_admin(message):
            await studentqueue.dequeue(message)
        else:
            await studentqueue.remove(message)
    if command_match(message, '!list', '!l'):
        await studentqueue.list_queue(message)
    if command_match(message, '!help', '!h'):
        await message.channel.send(HELP_MESSAGE)
    if command_match(message, '!status', '!s'):
        await studentqueue.status(message)
    if command_match(message, '!createRoom'):
        await createoffice.createOffice(message)

if __name__ == "__main__":
    client.run(os.getenv('DISCORD_BOT_KEY'))
    print('hello')
