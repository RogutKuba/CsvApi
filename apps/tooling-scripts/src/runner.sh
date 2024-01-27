# take in input file and run using node
# usage: ./runner.sh <input_file>

# get the input file
input_file=$1

# run the input file
node --env-file=.env.local -r source-map-support/register dist/scripts/$input_file.js