# coding: utf-8

from copy import copy
from corewar_driver.corewar.redcode import Instruction

__all__ = ['DEFAULT_INITIAL_INSTRUCTION', 'Core']

DEFAULT_INITIAL_INSTRUCTION = Instruction('DAT', 'F', '$', 0, '$', 0)

class Core:
    """The Core itself. An array-like object with a bunch of instructions and
       warriors, and tasks.
    """

    def __init__(self, initial_instruction=DEFAULT_INITIAL_INSTRUCTION,
                 size=8000, read_limit=None, write_limit=None):
        self.size = size
        self.write_limit = write_limit if write_limit else self.size
        self.read_limit = read_limit if read_limit else self.size
        self.clear()

    def clear(self, instruction=DEFAULT_INITIAL_INSTRUCTION):
        """Writes the same instruction thorough the entire core.
        """
        self.instructions = [instruction.core_binded(self) for i in range(self.size)]
        self.owner = [0 for _ in range(self.size)]
        self.modified = [0 for _ in range(self.size)]

    def trim_write(self, address):
        "Return the trimmed address to write, considering the write limit."
        return self._trim(address, self.write_limit)

    def trim_read(self, address):
        "Return the trimmed address to read, considering the read limit."
        return self._trim(address, self.read_limit)

    def trim(self, value):
        "Return a trimmed value to the bounds of the core size"
        return value % len(self)

    def trim_signed(self, value):
        "Return a trimmed value to the bounds of -core size to +core size"
        return value % len(self) if abs(value) > len(self) else value

    def _trim(self, address, limit):
        "Trims an address in the core, given a limit."
        result = address % limit
        if result > limit/2:
            result += self.size - limit
        return result

    def __getitem__(self, address):
        if isinstance(address, float):
            return self.instructions[int(address % self.size)]
        elif isinstance(address,slice):
            start = address.start
            stop = address.stop
            if start > stop:
                return self.instructions[start:] + self.instructions[:stop]
            else:
                return self.instructions[start:stop]
        return self.instructions[address % self.size]


    def __setitem__(self, address, value):
        if isinstance(value, tuple) and len(value) == 2:
            instruction, owner = value
            self.instructions[int(address % self.size)] = instruction
            self.owner[int(address % self.size)] = owner
            self.modified[int(address % self.size)] = owner

        else:
            self.instructions[int(address % self.size)] = value

    def __iter__(self):
        return iter(self.instructions)

    def __len__(self):
        return self.size

    def __repr__(self):
        return "<Core size=%d>" % self.size
    
    def get_owner(self, address):
        """Return the owner of the cell at the given address."""
        return self.owner[address % self.size]
    
    def get_modified(self, address):
        """Return the warrior who last modified the cell at the given address."""
        return self.modified[address % self.size]
    
    def set_owner(self, address, value):
        """Change the owner of the cell at the given address."""
        self.owner[address % self.size] = value
        return self.owner[address % self.size]
    
    def set_modified(self, address, value):
        """Change the warrior who modified the cell at the given address."""
        self.modified[address % self.size] = value
        return self.modified[address % self.size]
    
    def reset_owner(self):
        """Reset the ownership array."""
        self.owner = [0 for _ in range(self.size)]

    def reset_modified(self):
        """Reset the modified array."""
        self.modified = [0 for _ in range(self.size)]
