class Warrior(object):

    def __init__(self,name):
        self.name = name,
        self.won = 0,
        self.lost = 0,
        self.busy = False

    
    def __init__(self,name,won,lost,busy):
        self.name = name,
        self.won = won,
        self.lost = lost,
        self.busy = busy


    def saveToDB(self,ref,user_id):
        worrior_data = {
            "user_id": user_id,
            "name": self.name,
            "won": self.won,
            "lost": self.lost,
            "busy": self.busy
        }
        ref.child('warriors').push(worrior_data)
