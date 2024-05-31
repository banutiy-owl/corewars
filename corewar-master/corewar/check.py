from corewar.game import game

dwarf = """
;name Gemini
;author A. K. Dewdney

        DAT.f    $0,    $0
        DAT.f    $0,     $99
        MOV.i   @-2,    @-1
        SNE.b   $-3,     #9
        JMP.f   $4,     $0
        ADD.ab  #1,     $-5
        ADD.ab  #1,     $-5
        JMP.f   $-5,    $0
        MOV.ab  #99,    $93
        JMP.f   $93,    $0

        END     2
"""
bot = """
;Name Fastest CoreClear
;Author Rodrigo Setti
;Strat Limpa a memoria rapidamente, entretando
;Strat nuo possui cdigo anti-destruicco.

MOV.i	$2,	$2
JMP.b	$-1,	>-1
"""

cycles, round_winner_id, wins, core_states = game(123, dwarf, 321, bot, rounds=4)

print(cycles)
print(round_winner_id),
print(wins),
f = open("testfile.txt", "a")
f.write(core_states)
f.close()