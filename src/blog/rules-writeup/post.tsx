const post = `## Write up for corctf2025 \`crypto/rules\`

### Challenge Summary
\`rules\` is a CTF challenge in which the user must submit an array of bytes and a guess of the resulting byte array after an algorithm, or rule, has been applied to the byte array a random number of times.

<img src="./rulesgui1.png" style="display:block;margin:auto;" alt="Image showing the CLI of the rules challenge" width="400"/>

The challenge lies in constructing a byte array with a predictable behavior even when being manipulated an unknown number of times.

### Constraints
Before constructing this byte array, some constraints must be met by the byte array, which can be seen by looking at the main body of the provided program.

\`\`\`python
print("Enter the bytes:")
user_input = input("> ")
arr = json.loads(user_input)
if not isinstance(arr, list) or not all(isinstance(x, int) for x in arr):
	print("Invalid input")
	return
	
data = np.array(arr, dtype=np.uint8)
if len(data) < 1024:
	print("Too short")
	return
	
print("Make a guess:")
user_guess = input("> ")
user_guess = user_input
guess = np.array(json.loads(user_guess), dtype=np.uint8)

if guess.shape != data.shape:
	print("Invalid guess")
	return

print("Checking guess...")
num_rounds = random.randint(100, 16000)

for i in range(num_rounds):
	data = rule(data)
	if not np.any(data):
		print("All zeroes!")
		return
\`\`\`

1. The byte array must be submitted as an array of 8 bit integers
2. The byte array's length must be at least 1024 elements.
3. The byte array must not result in all 0's

Knowing that we need to be able to predict the final byte array, in an ideal sense we would have a byte array that doesn't change, or at least one that acts in a very short loop when operated on by \`rule()\`. To construct this, let's take a deeper look at \`rule()\`.
### The Rule
The titular "rule" of this challenge consists of a series of bit manipulations, which are defined below:

\`\`\`python
def rotate_left(data):
    upper = data << 1
    lower = np.roll(data, -1) >> 7
    return upper | lower

def rotate_right(data):
    lower = data >> 1
    upper = np.roll(data, 1) << 7
    return upper | lower

def rule(data):
    left = rotate_left(data)
    right = rotate_right(data)
    
    return ~((left & right & data) | (~left & ~right & ~data) | (~left & right & ~data))
\`\`\`

In order to simplify this, I decided to use a solution using an array consisting of 1024 of the same byte. While there likely are other solutions using a different approach, this approach means I don't need to consider the \`np.roll\` function, as all entries in the array are the same.
In order to visualize this rule, I will label each bit as its original index in data (ex: \`01234567\` indicates no change to the byte).

\`\`\`python
def rotate_left(01234567):
    return 12345670 # just a rotation 1 left

def rotate_right(01234567):
    return 70123456 # just a rotation 1 right

def rule(01234567):
    left  = rotate_left (01234567) # 12345670
    right = rotate_right(01234567) # 70123456
    
    part1 = ( left &  right &  data) # bitwise AND of all bytes
	part2 = (~left & ~right & ~data) # bitwise NOR of all bytes
	part3 = (~left &  right & ~data) # bitwise NOR of left and data, then bitwise AND with right
	
    return ~(part1 | part2 | part3)  # bitwise NOR of all bytes
\`\`\`

To gain some intuition with this, I will walk through the steps with a fairly simple example: \`1\` (\`0x01\` or \`0b00000001\`)

\`\`\`python
def rule(0b00000001):
    left  = rotate_left (0b00000001) # 0b00000010
    right = rotate_right(0b00000001) # 0b10000000
    
    part1 = ( 0b00000010 &  0b10000000 &  0b00000001) # 0b00000000
	part2 = (~0b00000010 & ~0b10000000 & ~0b00000001) # 0b01111100
	part3 = (~0b00000010 &  0b10000000 & ~0b00000001) # 0b10000000
	
    return ~(0b00000000 | 0b01111100 | 0b10000000)    # 0b00000011 (3)
\`\`\`

After making a simple program to record the updated array at each step, we get the following result when starting with 1 (\`0b00000001\`). Remember that we are looking for steady numbers or short loops, and that these are arrays of 1024 8 bit integers.

\`\`\`python
[1   1   1   ... 1   1   1  ]
[3   3   3   ... 3   3   3  ]
[7   7   7   ... 7   7   7  ]
[13  13  13  ... 13  13  13 ]
[31  31  31  ... 31  31  31 ]
[49  49  49  ... 49  49  49 ]
[115 115 115 ... 115 115 115]
[215 215 215 ... 215 215 215]
[124 124 124 ... 124 124 124]
[196 196 196 ... 196 196 196]
[205 205 205 ... 205 205 205]
[95  95  95  ... 95  95  95 ]
[241 241 241 ... 241 241 241]
[19  19  19  ... 19  19  19 ]
[55  55  55  ... 55  55  55 ]
[125 125 125 ... 125 125 125]
[199 199 199 ... 199 199 199]
[76  76  76  ... 76  76  76 ]
[220 220 220 ... 220 220 220]
[245 245 245 ... 245 245 245]
[31  31  31  ... 31  31  31 ]
[49  49  49  ... 49  49  49 ]
[115 115 115 ... 115 115 115]
# (Continues)
\`\`\`

Notice that the byte does eventually reach a loop after becoming 31, as 31 appears again 16 cycles later.  (Stopping at this point would give you a 1/16 chance of getting the flag at each submission, but let's see if we can do better).

Now let's take a look at the binary forms of the numbers:

\`\`\`python
[1   1   1   ... 1   1   1  ] # 0b00000001
[3   3   3   ... 3   3   3  ] # 0b00000011
[7   7   7   ... 7   7   7  ] # 0b00000111
[13  13  13  ... 13  13  13 ] # 0b00001101
[31  31  31  ... 31  31  31 ] # 0b00011111
[49  49  49  ... 49  49  49 ] # 0b00110001
[115 115 115 ... 115 115 115] # 0b01110011
[215 215 215 ... 215 215 215] # 0b11010111
[124 124 124 ... 124 124 124] # 0b01111100
[196 196 196 ... 196 196 196] # 0b11000100
[205 205 205 ... 205 205 205] # 0b11001101
[95  95  95  ... 95  95  95 ] # 0b01011111
[241 241 241 ... 241 241 241] # 0b11110001
[19  19  19  ... 19  19  19 ] # 0b00010011
[55  55  55  ... 55  55  55 ] # 0b00110111
[125 125 125 ... 125 125 125] # 0b01111101
[199 199 199 ... 199 199 199] # 0b11000111
[76  76  76  ... 76  76  76 ] # 0b01001100
[220 220 220 ... 220 220 220] # 0b11011100
[245 245 245 ... 245 245 245] # 0b11110101
\`\`\`

You might have noticed that the string \`0111\` behaves oddly, as is appears to somewhat consistently leave behind a residue looking like \`1101\` (look at 7 $\\to$ 11, 115 $\\to$ 215, and 55 $\\to$ 125). It's possible that  \`0111\` act like a glider of sorts. Furthermore, because \`rule()\` essentially looks at bits as wrapping around on themselves due to its rotation functions, if \`0111\` actually leaves behind \`1101\`, stacking two of them would lead to a cycle of only 2, as the \`0\`s would just be shifting right by 2 each iteration.

Lets see what happens if we use \`0b01110111\` (119):

\`\`\`python
def rule(0b01110111): #119
    left  = rotate_left (0b01110111) # 0b11101110
    right = rotate_right(0b01110111) # 0b10111011
    
    part1 = ( 0b11101110 &  0b10111011 &  0b01110111) # 0b00100010
	part2 = (~0b11101110 & ~0b10111011 & ~0b01110111) # 0b00000000
	part3 = (~0b11101110 &  0b10111011 & ~0b01110111) # 0b00000000
	
    return ~(0b00100010 | 0b00000000 | 0b00000000)    # 0b11011101 (221)
\`\`\`

This does in fact work! You can check for yourself that \`rule(119) = 221\`. Now we simply need to create an array of 1024 \`119\`s, and submit that for both the starting array and the input, and we should have a 50/50 of getting the flag, which isn't too bad.

I did that using this script to copy the array to my clipboard automatically, but there are many other ways of doing this.

\`\`\`python
import pyperclip

arraystring = "["

for i in range(1023):
    arraystring +="119,"
arraystring += "119]"

pyperclip.copy(arraystring)
\`\`\`

### Conclusion & Bonus Analysis
Thank you to the CoR team for organizing this event! This was an interesting challenge, and I had fun!

You might be wondering at this point:
1. Is 2 the shortest loop?
2. Couldn't we just test all the byte arrays? There's only 256 8 bit integers?

These are valid questions, and after the CTF, I took the time to write some code to generate a graph of all of the possible byte arrays made up of only 1 integer.

<img src="./rulesgraph2.png" style="display:block;margin:auto;" alt="Image showing a directional graph of the byte arrays" width="600"/>

As you can see, 2 is the smallest cycle; however, there are 2 cycles of 2. In addition, there are 3 other cycles. 2 cycles of 16, and a cycle of 8 that is disconnected from the rest of the graph. The component at the top is all the numbers that go to 0, which is stable by itself. While not immediately present, the mirrored aspect of the graph is due to many components being identical but bit rotated by 1.

There may be a byte array that is stable, but it couldn't be made up of only one repeated byte.`;

export default post ;