from corewar_driver.corewar.game import game

dwarf = """
;name dwarf
;author A. K. Dewdney

org inicio

adic	add.ab  #2004,	$inicio
inicio	mov.i   $2,	$2
	jmp.f   $adic,	#0
"""
bot = """
;Name Dwarf Jumper
;Author	Rodrigo Setti
;Strat Lan�a c�digos de "pris�o" pela mem�ria
;Strat que mant�m os processos inimigos
;Strat paralizados, por�m, n�o � mortal.


org 1

mov.i	$1,	>2
jmp.f   $-1,    >1
"""

cycles, round_winner_id, wins, core_states, exceptions = game(123, dwarf, 321, bot)

print(cycles)
print(round_winner_id)
print(wins)
print(exceptions)
f = open("testfile.txt", "a")
f.write(core_states)
f.close()