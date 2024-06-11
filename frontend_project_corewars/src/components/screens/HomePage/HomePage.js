import { React, useEffect, useState } from "react";

import Header from "../../Header";
import "./HomePage.css";
import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
          navigate('/');
          return;
        }
    setusername(storedUsername);
  }, []);
  return (
    <div className="body home">
      <Header />
      <div className="header">
        <div className="user-text-welcome">
          Welcome {username}
          <div className="underline"></div>
        </div>
      </div>

      <div className="description-text-user">
        CoreWars is a game where programs called “warriors”, written in an
        assembly-like language called Redcode, compete for control of a virtual
        memory.
      </div>

      <div className="instructions">
        <h3>How to use this page</h3>
        <p>
          In the “Warriors” tab you may add and edit your warrior’s codes. You
          can write code directly in the provided editor, or upload it from your
          filesystem. If you want to send your warrior to a game with someone
          else’s warrior, use the tab “New game”. There you can chose a warrior
          that isn’t already in a journey and send them on their way. If there
          is no opponent waiting, the warrior will have to wait for their
          appearance. In the meantime, you can start new games as well. Any way,
          when game is over, you will be able to see the results in the
          “History” tab. By choosing the game from the list you can study the
          code of the opponent warrior and see the last state of the core in
          every round.
        </p>
        <h3>How the game works</h3>
        <p>
          The core is a cyclic memory array. This means that if you try to
          access a cell beyond the end of the core, it wraps around to the
          beginning. Each instruction in a program occupies one memory cell.
          Both warriors codes are loaded and executed in the same core. Each
          warrior in the game consists of one or more processes. A process is a
          pointer that iterates over the instructions in the warrior’s code. In
          each step of the game, one instruction from one process of one warrior
          is executed. The instruction to be executed is determined by the
          current position of the process in the core. After executing an
          instruction, the process moves to the next instruction in the
          sequence. The game alternates between the warriors. This means that in
          one step, a process from one warrior executes an instruction, and in
          the next step, a process from the other warrior executes an
          instruction. A warrior wins the game by causing all the processes of
          the opponent to terminate. This happens when an opponent's process
          attempts to execute a DAT instruction or if there are no valid
          instructions left for it to execute. The goal is to disrupt or
          overwrite the opponent’s code in the core by alternating or copying
          harmful code into the opponent’s instructions. 10 rounds of the game
          are played with warriors codes loaded in random places. The final
          winner is the warrior with the most rounds won.
        </p>
        <h3>How to write a code</h3>
        <p>A warrior program consists of several components:</p>
        <ul>
          <li>
            <strong>Comments</strong> start with a semicolon (;) and continue to
            the end of the line. They are not considered as executable.
          </li>
          <li>
            <strong>Informational directives</strong> are not required, but
            might help you keep track of your code.
            <ul>
              <li>
                <code>;redcode</code> marks the beginning of the Redcode
                program. If used, all the code written before the first
                declaration and all the code after the second one will be
                ignored.
              </li>
              <li>
                <code>;name</code> followed by the name of the program. If not
                specified – “Unnamed”.
              </li>
              <li>
                <code>;author</code> followed by the your nickname.
              </li>
              <li>
                <code>;date</code> followed by a date of editing.
              </li>
              <li>
                <code>;version</code> followed by a version number.
              </li>
              <li>
                <code>;strategy</code> – the algorithm of your program described
                by words.
              </li>
              <li>
                <code>;assert</code> - a condition that should hold true at the
                start of the program. For example, your program may work it’s
                best on core where CORESIZE == 2000. However, consider that out
                core is stable for now, and has the size, read- and write- limit
                of 8000. The page will inform you if the assert condition is not
                met once you try to add the code.
              </li>
            </ul>
          </li>
          <li>
            <strong>Control directives</strong> are optional, but have an impact
            on code execution.
            <ul>
              <li>
                <code>ORG</code> – allows to set the starting execution point of
                the program. Followed by an address indicating the start address
                relative to the first address in the warrior. Is usually placed
                at the top of the code.
              </li>
              <li>
                <code>END</code> – serves the same purpose as ORG. If used,
                should be placed at the end of the code.
              </li>
              <li>
                <code>EQU</code> – defines constants to be used throughout the
                program. For example: “step EQU 4” means that constant step = 4.
              </li>
            </ul>
          </li>
        </ul>
        <p>
          <h4>Instructions/operands</h4>
        </p>
        <p>
          Instructions in Redcode are commands that tell the warrior what
          actions to perform. Instructions have two fields, referred to as the
          A-field and the B-field. All opcodes are executed after the operand
          addressing modes are evaluated.
        </p>
        <ul>
          <li>
            <code>DAT:</code> Terminates the process that executes it.
          </li>
          <li>
            <code>MOV:</code> Copies data from the A-field to the B-field.
          </li>
          <li>
            <code>ADD:</code> Adds the value in the A-field to the value in the
            B-field.
          </li>
          <li>
            <code>SUB:</code> Subtracts the value in the A-field from the value
            in the B-field.
          </li>
          <li>
            <code>MUL:</code> Multiplies the value in the A-field with the value
            in the B-field.
          </li>
          <li>
            <code>DIV:</code> Divides the value in the B-field by the value in
            the A-field.
          </li>
          <li>
            <code>MOD:</code> Calculates the modulus of the value in the B-field
            with the value in the A-field.
          </li>
          <li>
            <code>JMP:</code> Jumps to the address specified in the A-field.
          </li>
          <li>
            <code>JMZ:</code> Jumps to the address in the A-field if the value
            in the B-field is zero.
          </li>
          <li>
            <code>JMN:</code> Jumps to the address in the A-field if the value
            in the B-field is not zero.
          </li>
          <li>
            <code>DJN:</code> Decrements the value in the B-field and jumps to
            the address in the A-field if the result is not zero.
          </li>
          <li>
            <code>SPL:</code> Creates a new process at the address specified in
            the A-field.
          </li>
          <li>
            <code>SLT:</code> Skips the next instruction if the value in the
            A-field is less than the value in the B-field.
          </li>
          <li>
            <code>CMP / SEQ:</code> Compares the values in the A-field and
            B-field and skips the next instruction if they are equal.
          </li>
          <li>
            <code>SNE:</code> Skips the next instruction if the values in the
            A-field and B-field are not equal.
          </li>
          <li>
            <code>NOP:</code> No operation. Does nothing.
          </li>
        </ul>
        <h4>Modifiers</h4>
        <p>Modifiers specify how the instruction's operands are used:</p>
        <ul>
          <li>
            <code>a:</code> A-field of the source to A-field of the destination.
          </li>
          <li>
            <code>b:</code> B-field of the source to B-field of the destination.
          </li>
          <li>
            <code>ab:</code> A-field of the source to B-field of the
            destination.
          </li>
          <li>
            <code>ba:</code> B-field of the source to A-field of the
            destination.
          </li>
          <li>
            <code>f:</code> A and B operands of the source and the A and B
            operands of the destination.
          </li>
          <li>
            <code>x:</code> A and B operands of the source and the B and A
            operands of the destination.
          </li>
          <li>
            <code>i:</code> Instruction as a whole. Only applicable to MOV, SEQ
            and SNE.
          </li>
        </ul>

        <h4>Addressing modes</h4>
        <ul className="addressing-mode">
          <li>
            <code>#</code>: Immediate mode: The value itself.
          </li>
          <li>
            <code>$</code>: Direct mode: The value at the address.
          </li>
          <li>
            <strong>Example 1:</strong>{" "}
            <span className="example-code">
              <code>mov.i $0, $1</code>
            </span>
            <span className="example-comment">
              {/* Add your comment text here */}
            </span>
          </li>
          <li>
            <strong>Example 2:</strong>{" "}
            <span className="example-code">
              <code>mov.i $0, $-1</code>
            </span>
          </li>

          <li>
            <code>*:</code> A Indirect mode: Uses the executing instruction's
            operand as a pointer to an intermediate instruction. This second
            instruction's A field is then used as a direct reference to the
            instruction of interest.
          </li>
          <p className="example-code">
            <strong>Example:</strong> <code>mov.i *1, $2</code>
          </p>
          <pre className="example-comment">
            <div className="code-block">
              <pre>
                mov.i *1, $2
                <br />
                dat 2, 0; - 2 is used as a pointer
                <br />
                dat 0, 0; - this instruction will be overwritten
                <br />
                jmp 0; - with this instruction
              </pre>
            </div>
          </pre>
          <li>
            <code>@:</code> B Indirect mode: Works in the same way as the A
            Indirect (*) addressing mode described above except that it uses the
            intermediate instruction's B field as a pointer rather than its A
            field.
          </li>
          <li>
            <code>&#123;:</code> A Pre-decrement Indirect: Works in the same way
            as the A Indirect (*) addressing mode detailed above with the
            addition that it first decrements the A number before using it as a
            pointer.
          </li>
          <li>
            <code>&#125;:</code> A Post-increment Indirect: Works in the same
            way as the A Indirect (*) addressing mode detailed above with the
            addition that it increments the A number after using it as a
            pointer.
          </li>
          <li>
            <code>&gt;:</code> B Pre-decrement Indirect: Works in the same way
            as the A Pre-decrement Indirect (&#123;) addressing mode detailed
            above except it decrements and uses the intermediate instruction's B
            number as a pointer, rather than its A number.
          </li>
          <li>
            <code>&lt;:</code> B Post-increment Indirect: Works in the same way
            as the A Post-increment Indirect (&#125;) addressing mode detailed
            above except it increments and uses the intermediate instruction's B
            number as a pointer, rather than its A number.
          </li>
        </ul>
        <h4>Labels</h4>
        <p>
          Labels allow aliases to be defined for addresses within your code. To
          specify a label, enter its name in front of the instruction's opcode.
          A label name must begin with an alphabetic character (a-z) or an
          underscore. The rest of the label can contain alphanumeric characters
          or underscores.
        </p>
        <p>
          Once a label is declared, it can be used throughout your redcode in
          place of an operand's number as demonstrated below.
        </p>
        <pre>
          <pre className="code-block">
            bmb: dat #4, #0
            <br />
            top: add.ab bmb, bmb
            <br />
            <div className="padd_example">
              mov.i bmb, @bmb
              <br />
              jmp top
              <br />
            </div>
          </pre>
        </pre>
        <p>
          Here we have declared two labels bmb and top. The bmb label refers to
          the dat instruction's address and top to the add instruction's
          address.
        </p>
        <h4>Example program: Dwarf</h4>
        <pre className="code-block">
          ;name Dwarf
          <br />
          ;author A. K. Dewdney
          <br />
          ;strategy Throw DAT bombs around memory, hitting every 4th memory
          cell.
          <br />
          ;strategy This program was presented in the first Corewar article.
          <br />
          ;assert (CORESIZE % 4)==0
          <br />
          bomb dat #0
          <br />
          dwarf add #4,bomb
          <br />
          <div className="dwarf_example">
            mov bomb,@bomb
            <br />
            jmp dwarf
            <br />
            end dwarf
            <br />
          </div>
        </pre>
        <div className="dwarf_example_example">
          This Dwarf program by A. K. Dewdney methodically places DAT bombs in
          the core memory at regular intervals (every 4 cells). It achieves this
          by continuously recalculating bomb positions and copying the DAT
          instruction to these positions in an infinite loop.
        </div>
        <ol className="padd_example">
          <li>
            The <code>assert (CORESIZE % 4) == 0</code> ensures that the core
            size is a multiple of 4, which aligns with the bombing interval.
          </li>
          <li>
            The program starts executing from the ‘dwarf’ label, as defined by
            the <code>end dwarf</code> directive.
          </li>
          <li>
            The ‘bomb’ instruction <code>dat #0</code> is initially set in
            memory. This DAT instruction acts as a bomb that will terminate any
            process that attempts to execute it.
          </li>
          <li>
            First iteration:
            <ul>
              <li>
                The <code>add #4, bomb</code> instruction adds 4 to the address
                of the bomb label. This modifies the target address where the
                next bomb will be placed.
              </li>
            </ul>
          </li>
        </ol>
        <div className="conclusion-text">
          That’s it from us. You can find more material on the net. Have fun
          playing!
        </div>
      </div>
    </div>
  );
}

export default HomePage;
