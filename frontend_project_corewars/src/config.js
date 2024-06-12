const config = {
    BASE_URL: 'http://127.0.0.1:5000',
  
    getUserInfoUrl: function() {
      return `${this.BASE_URL}/user_info`;
    },
    
    getGamesUrl: function() {
      return `${this.BASE_URL}/games`;
    },

    getGameUrl: function() {
      return `${this.BASE_URL}/game`;
    },

    getWarriorsUrl: function() {
      return `${this.BASE_URL}/warriors`;
    },

    getWarriorUrl: function() {
      return `${this.BASE_URL}/warrior`;
    },
    
    getLogingUrl: function() {
      return `${this.BASE_URL}/login`;
    },

    getRegisterUrl: function() {
      return `${this.BASE_URL}/register`;
    },


    
  };
  
  export default config;