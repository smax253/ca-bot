import database
import discord


async def initialize(client, message: discord.Message):
    try:
        database.create_document(message.channel.guild.id)
        await message.channel.send("Server initialized!")
    except NameError:
        await message.channel.send("Server already initialized!")


async def add_admin(client, message):
    args = message.content.split(" ")
    if len(args) > 1:
        data = database.get_doc_data_by_id(message.channel.guild.id)
        role = ' '.join(args[1:])
        if role not in data['admin_roles']:
            data['admin_roles'] += [role]
            database.update_data(message.channel.guild.id, data)
            await message.channel.send("Admin roles are now {0}".format(str(data['admin_roles'])))
        else:
            await message.channel.send("Role {0} is already an admin!".format(role))
    else:
        await message.channel.send("Please specify a role to add")

def createOffice(client):
    return
