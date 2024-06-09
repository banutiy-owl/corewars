from concurrent.futures import ThreadPoolExecutor, as_completed
from corewar_driver.corewar import mars, redcode
from corewar_driver.corewar.core import Core
from corewar_driver.corewar.redcode import OPCODES

def simulate_round(warrior_1, warrior_2, core_s, n_cycles):
    core_cr = Core(size=core_s)
    simulation = mars.MARS(warriors=[warrior_1, warrior_2], core=core_cr)
    for x in range(n_cycles):
        try:
            simulation.step()
            if not warrior_1.task_queue:
                return x, warrior_2.id, simulation, None
            elif not warrior_2.task_queue:
                return x, warrior_1.id, simulation, None
        except Exception as e:
            return x, -1, simulation, e
    return n_cycles, 0, simulation, None

def game(warrior_1_id, warrior_1_code, warrior_2_id, warrior_2_code, coresize=None, rounds=None, maxcycles=None):
    core_s = coresize if coresize else 8000
    DEFAULT_ENV = {'CORESIZE': core_s}
    n_rounds = rounds if rounds else 10
    n_cycles = maxcycles if maxcycles else 8000
    
    warrior_1 = redcode.parse(warrior_1_code.split('\n'), DEFAULT_ENV)
    warrior_1.id = 1
    warrior_2 = redcode.parse(warrior_2_code.split('\n'), DEFAULT_ENV)
    warrior_2.id = 2

    cycles = n_rounds * [None]
    wins = {warrior_1_id: 0, warrior_2_id: 0}
    round_winner_id = n_rounds * [None]
    core_states_l = [""] * n_rounds
    exceptions = n_rounds * [None]

    with ThreadPoolExecutor() as executor:
        future_to_round = {executor.submit(simulate_round, warrior_1, warrior_2, core_s, n_cycles): i for i in range(n_rounds)}
        
        for future in as_completed(future_to_round):
            i = future_to_round[future]
            try:
                cycle_count, winner_id, simulation, exception = future.result()
                cycles[i] = cycle_count
                round_winner_id[i] = winner_id
                if winner_id > 0:
                    wins[winner_id] += 1
                exceptions[i] = exception
                core_state = ""
                for j in range(core_s):
                    opcode = next(key for key, value in OPCODES.items() if value == simulation.core[j].opcode)
                    core_state += f"{opcode},{simulation.core.get_owner(j)},{simulation.core.get_modified(j)};"
                core_states_l[i] = core_state + "\n"
            except Exception as e:
                cycles[i] = -1
                round_winner_id[i] = -1
                exceptions[i] = e + "This is a program error, please contact our technical support."
    core_states = "".join(core_states_l)
    """cycles - lista cykli dla każdej rundy, 
    round_winner_id - lista z id zwycięzcy każdej rundy
        (0 jeżeli remis, 
        -1 jeżely był error, wtedy tekst error jest pod odpowiednim indeksem w exceptions), 
    wins - dict wygranych każdego wojownika,
    core_states - (string) stany końcowe pól w formacie np. DAT, 123, 321;...
        pierwsza liczba to owner, druga to modifier(warrior który ostatni zmienił komórkę)
    exceptions - lista errorów, jęzeli zaszły"""
    return cycles, round_winner_id, wins, core_states, exceptions