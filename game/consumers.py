import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Token

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'game_room'
        self.user_id = str(self.scope['client'][1])
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'chat' and data.get('recipient') != 'all':
            await self.send_private_message(data['content'], data['recipient'])
        elif data['type'] == 'token':
            await self.save_token(data)
            await self.channel_layer.group_send(self.room_group_name, {'type': 'game_message', 'message': data})
        elif data['type'] == 'token_delete':
            await self.delete_token(data['id'])
            await self.channel_layer.group_send(self.room_group_name, {'type': 'game_message', 'message': data})
        else:
            await self.channel_layer.group_send(self.room_group_name, {'type': 'game_message', 'message': data})

    @database_sync_to_async
    def save_token(self, data):
        token, created = Token.objects.update_or_create(
            id=data['id'],
            defaults={'name': data['name'], 'x': data['x'], 'y': data['y'], 'color': data['color']}
        )

    @database_sync_to_async
    def delete_token(self, token_id):
        Token.objects.filter(id=token_id).delete()

    async def game_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    async def send_private_message(self, content, recipient_name):
        for channel in self.channel_layer.groups.get(self.room_group_name, {}).keys():
            await self.channel_layer.send(
                channel,
                {
                    'type': 'game_message',
                    'message': {
                        'type': 'chat',
                        'content': content,
                        'recipient': recipient_name
                    }
                }
            )