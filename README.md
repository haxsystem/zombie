# Zombis
It is a tool that helps you create worker to only worry you logic and not the complexity of the process. It is based on Node using RabbitMQ for the transfer of message, with which you can go calling on workers to your liking.

# How does it work

![Zombies Scheme](http://images-of-the-applications.s3.amazonaws.com/zombies_scheme.png)


This type of worker is dedicated to performing work backgroud, such as:
 - List item
 - Load massive files
 - Office mass mail or transactional
 - CRON Migracios
 - Etc


----------
# To play

#### Dependence

 1. Node >= 0.12.0
 2. RabbitMQ >= 3.6.0
 3. npm >= 3.7.5

#### clone the project
  
    $ git clone git@github.com:haxsystem/zombis.git

#### Load node module

    $ cd /your/to/path/zombies
    $ npm i
    
#### Create a zombie

    $./cli/cli.js test_zombie
    
#### Launch zombies

    DEBUG=worker:* ./bin/start
    
#### Send a message

The zombie manager creates a queue with the following name zombie_land, here is sent messages with actions for each zombie (or worker) and to launch one this example would be:

    {"status":true, "action": "launch", "zombie_name":"test_zombie"}

For each worker created an MQ queue begins with the structure of zombie name: name. And in this calo you can send the instructions depending on the behavior that you created.

Each time a zombie processes a message coda at the end this is destroyed and automatically creates another zombie, in order to free the memory used by node.

#### **LICENSE**
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
