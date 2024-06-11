import concurrent.futures
from corewar_driver.corewar import mars, redcode
from corewar_driver.corewar.core import Core
from corewar_driver.corewar.redcode import OPCODES
import concurrent.futures

def run_round(round_index, warrior_1, warrior_2, core_s, n_cycles):
    print(f"Runda {round_index}\n")
    core_cr = Core(size=core_s)
    simulation = mars.MARS(warriors=[warrior_1, warrior_2], core=core_cr)
    for x in range(n_cycles):
        try:
            simulation.step()
            if not warrior_1.task_queue:
                return x, warrior_2.id, None, None
            elif not warrior_2.task_queue:
                return x, warrior_1.id, None, None
        except Exception as e:
            print(f"Exception at cycle {x}: {e}")
            return -1, -1, str(e), None
    core_state = ""
    for j in range(core_s):
        opcode = next(key for key, value in OPCODES.items() if value == simulation.core[j].opcode)
        core_state += f"{opcode},{simulation.core.get_owner(j)},{simulation.core.get_modified(j)};"
    return n_cycles, 0, None, core_state + "\n"

def game1(warrior_1_id, warrior_1_code, warrior_2_id, warrior_2_code, coresize=None, rounds=None, maxcycles=None):
    core_s = coresize if coresize else 8000
    DEFAULT_ENV = {'CORESIZE': core_s}
    n_rounds = rounds if rounds else 10
    n_cycles = maxcycles if maxcycles else 8000
    
    warrior_1 = redcode.parse(warrior_1_code.split('\n'), DEFAULT_ENV)
    warrior_1.id = 1
    warrior_2 = redcode.parse(warrior_2_code.split('\n'), DEFAULT_ENV)
    warrior_2.id = 2

    wins = {warrior_1_id: 0, warrior_2_id: 0}
    cycles = [None] * n_rounds
    round_winner_id = [None] * n_rounds
    core_states_l = [""] * n_rounds
    exceptions = [None] * n_rounds

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(run_round, i, warrior_1, warrior_2, core_s, n_cycles)
            for i in range(n_rounds)
        ]
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            cycle, winner_id, exception, core_state = future.result()
            cycles[i] = cycle
            round_winner_id[i] = winner_id
            if winner_id == warrior_1.id:
                wins[warrior_1_id] += 1
            elif winner_id == warrior_2.id:
                wins[warrior_2_id] += 1
            exceptions[i] = exception
            core_states_l[i] = core_state if core_state else ""

    core_states = "".join(core_states_l)
    return cycles, round_winner_id, wins, core_states, exceptions



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

    for i in range (10):
        core_cr = Core(size=core_s)
        simulation = mars.MARS(warriors=[warrior_1, warrior_2], core=core_cr)
        for x in range(n_cycles):
            try:
                simulation.step()
                if not warrior_1.task_queue:
                    cycles[i] = x
                    round_winner_id[i] = warrior_2.id
                    wins[warrior_2_id] += 1
                    exceptions[i] = None
                    break
                elif not warrior_2.task_queue:
                    cycles[i] = x
                    round_winner_id[i] = warrior_1.id
                    wins[warrior_1_id] += 1
                    exceptions[i] = None
                    break
            except Exception as e:
                print(f"Exception at cycle {x}: {e}")
                cycles[i] = -1
                round_winner_id[i] = -1
                exceptions[i] = e
        else:
            cycles[i] = n_cycles
            round_winner_id[i] = 0
            exceptions[i] = None
        core_state = ""
        for j in range(core_s):
            opcode = next(key for key, value in OPCODES.items() if value == simulation.core[j].opcode)
            core_state += f"{opcode},{simulation.core.get_owner(j)},{simulation.core.get_modified(j)};"
        core_states_l[i] = core_state + "\n"
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