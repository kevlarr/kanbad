# Runs the provide command and args with fat jar and config file
java -jar $(find . -name '*all.jar') "$@" ./twello.yml
