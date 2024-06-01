from corewar_driver.corewar import mars, redcode
from corewar_driver.corewar.redcode import OPCODES

def game(warrior_1_id, warrior_1_code, warrior_2_id, warrior_2_code, coresize = None, rounds = None, maxcycles = None):
    core = coresize if coresize else 8000
    DEFAULT_ENV = {'CORESIZE': core} #'MAXLENGTH': 100}
    n_rounds = rounds if rounds else 10
    n_cycles = maxcycles if maxcycles else 8000
    
    warrior_1 = redcode.parse(warrior_1_code.split('\n'), DEFAULT_ENV)
    warrior_1.id = warrior_1_id
    warrior_2 = redcode.parse(warrior_2_code.split('\n'), DEFAULT_ENV)
    warrior_2.id = warrior_2_id

    cycles = n_rounds * [None]
    wins = {}
    wins[warrior_1_id] = 0
    wins[warrior_2_id] = 0
    round_winner_id = n_rounds * [None]
    core_states = ""
    exceptions = n_rounds * [None]

    for i in range(n_rounds):
        # run simulation for at most
        print(f"Round {i}")
        simulation = mars.MARS(warriors=[warrior_1, warrior_2])
        for x in range(n_cycles):
            try:
                simulation.step()
                if not warrior_1.task_queue: 
                    cycles[i] = x
                    wins[warrior_2_id] += 1
                    round_winner_id[i] = warrior_2_id
                    break
                elif not warrior_2.task_queue:
                    cycles[i] = x
                    wins[warrior_1_id] += 1
                    round_winner_id[i] = warrior_1_id
                    break
            except Exception as e:
                cycles[i] = x
                round_winner_id[i] = -1
                exceptions[i] = e
        else:
            cycles[i] = n_cycles
            round_winner_id[i] = 0
        for i in range(core):
            opcode = next(key for key,value in OPCODES.items() if value==simulation.core[i].opcode)
            core_states = core_states + str(opcode) + ", " + str(simulation.core.get_owner(i)) + ", "+ str(simulation.core.get_modified(i)) + "; "
        core_states = core_states+"\n"
            
    """cycles - lista cykli dla każdej rundy, 
    round_winner_id - lista z id zwycięzcy każdej rundy
        (0 jeżeli remis, 
        -1 jeżely był error, wtedy tekst error jest pod odpowiednim indeksem w exceptions), 
    wins - dict wygranych każdego wojownika,
    core_states - (string) stany końcowe pól w formacie np. DAT, 123, 321;...
        pierwsza liczba to owner, druga to modifier(warrior który ostatni zmienił komórkę)
    exceptions - lista errorów, jęzeli zaszły"""
    return(cycles, round_winner_id, wins, core_states, exceptions)