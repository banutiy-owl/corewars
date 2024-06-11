import Warrior from "./Warrior";

const WarriorList = ({ warriors, onEdit, onDelete }) => (
  <div className="warrior-list">
    {warriors.length === 0 ? (
      <p className="yet">You have no warriors under your command yet.</p>
    ) : (
      warriors.map((warrior) => (
        <Warrior
          key={warrior.id}
          warrior={warrior}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

export default WarriorList;
