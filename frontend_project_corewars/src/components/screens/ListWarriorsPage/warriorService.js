// src/components/screens/WarriorsPage/warriorService.js
export const addWarrior = (warriors, name) => {
    const newWarrior = {
      id: warriors.length ? warriors[warriors.length - 1].id + 1 : 1,
      name,
      busy: false,
      won: 0,
      lost: 0,
    };
    return [...warriors, newWarrior];
  };
  
  export const editWarrior = (warriors, updatedWarrior) => {
    return warriors.map(warrior => 
      warrior.id === updatedWarrior.id ? updatedWarrior : warrior
    );
  };
  
  export const deleteWarrior = (warriors, id) => {
    return warriors.filter(warrior => warrior.id !== id);
  };
  