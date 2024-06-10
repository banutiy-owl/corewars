class Warrior(object):
    
    def __init__(self,warrior_id,user_id,name,code,won=0,lost=0,busy=False):
        self.warrior_id = warrior_id,
        self.user_id = user_id,
        self.name = name,
        self.code = code,
        self.won = won,
        self.lost = lost,
        self.busy = busy


    # def saveToDB(self,ref,user_id):
    #     worrior_data = {
    #         "user_id": user_id,
    #         "name": self.name,
    #         "won": self.won,
    #         "lost": self.lost,
    #         "busy": self.busy
    #     }
    #     ref.child('warriors').push(worrior_data)
