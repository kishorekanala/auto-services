package main

import (
	"fmt"
	"time"

	zmq "github.com/pebbe/zmq4"
)

func main() {
	// Create a new ZeroMQ context
	context, err := zmq.NewContext()
	if err != nil {
		fmt.Println("Error creating ZeroMQ context:", err)
		return
	}
	defer context.Term()

	// Create a new ZeroMQ publisher socket
	publisher, err := context.NewSocket(zmq.PUB)
	if err != nil {
		fmt.Println("Error creating ZeroMQ publisher socket:", err)
		return
	}
	defer publisher.Close()

	// Bind the publisher socket to a TCP address
	err = publisher.Bind("tcp://*:5555")
	if err != nil {
		fmt.Println("Error binding ZeroMQ publisher socket:", err)
		return
	}

	// Publish the FUELTANKCAP STATUS message with "close" status
	for {
		message := "FUELTANKSTATUS close"
		_, err = publisher.Send(message, 0)
		if err != nil {
			fmt.Println("Error sending message:", err)
			return
		}
		fmt.Println("Published:", message)
		time.Sleep(1 * time.Second) // Publish every second
	}
}
