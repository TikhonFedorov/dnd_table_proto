import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'game_room'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_message',
                'message': data
            }
        )

    async def game_message(self, event):
        message = event['message']
        if message['type'] == 'token':
            await self.send(text_data=json.dumps({
                'type': 'token',
                'id': message['id'],
                'x': message['x'],
                'y': message['y']
            }))
        elif message['type'] == 'chat':
            await self.send(text_data=json.dumps({
                'type': 'chat',
                'content': message['content']
            }))
        elif message['type'] == 'dice':
            await self.send(text_data=json.dumps({
                'type': 'dice',
                'diceType': message['diceType'],
                'result': message['result']
            }))