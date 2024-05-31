#! /usr/bin/env python
#! coding: utf-8

import unittest

from corewar.redcode import *

DEFAULT_ENV = {'CORESIZE': 8000}

class TestRedcodeAssembler(unittest.TestCase):

    def test_1(self):

        input = """
                ;name dwarf
                ;author A. K. Dewdney
                ;assert CORESIZE % 4 == 0

                org start
                step equ 2004

                loop    add.ab  #step,  stary
                start   mov     2, 2
                        jmp.f   $loop ;go back and start over
                """
        with self.assertRaises(ValueError):
            parse(input.split('\n'), DEFAULT_ENV)
    
    def test_2(self):
        input = """
                ;name dwarf
                ;author A. K. Dewdney
                ;assert CORESIZE % 4 == 0

                org stary
                step equ 2004

                loop    add.ab  #step,  start
                start   mov     2, 2
                        jmp.f   $loop ;go back and start over
                """
        with self.assertRaises(ValueError):
            parse(input.split('\n'), DEFAULT_ENV)


if __name__ == '__main__':
    unittest.main()

