package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// Define a struct to parse the JSON message
type Message struct {
	Action string `json:"action"`
}

type State int

const (
	StateIdle State = iota
	StateOpening
	StateOpen
	StateClosing
	StateClosed
)

type Event int

const (
	EventOpen Event = iota
	EventClose
	EventOpened
	EventClosed
)

type StateMachine struct {
	currentState State
}

func NewStateMachine() *StateMachine {
	return &StateMachine{currentState: StateIdle}
}

func (sm *StateMachine) Transition(event Event) {
	switch sm.currentState {
	case StateIdle:
		if event == EventOpen {
			sm.currentState = StateOpening
			fmt.Println("Transitioning to StateOpening")
		}
	case StateOpening:
		if event == EventOpened {
			sm.currentState = StateOpen
			fmt.Println("Transitioning to StateOpen")
		}
	case StateOpen:
		if event == EventClose {
			sm.currentState = StateClosing
			fmt.Println("Transitioning to StateClosing")
		}
	case StateClosing:
		if event == EventClosed {
			sm.currentState = StateClosed
			fmt.Println("Transitioning to StateClosed")
		}
	case StateClosed:
		if event == EventOpen {
			sm.currentState = StateOpening
			fmt.Println("Transitioning to StateOpening")
		}
	}
}

var sm = NewStateMachine()

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		var msg Message
		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Println("Error unmarshalling JSON:", err)
			continue
		}

		if msg.Action == "openFuelTank" {
			fmt.Println("Received action to open fuel tank")
			if openFuelTank() == 0 {
				fmt.Println("Sending message to acknowledge that open is successful")
				ackMessage := Message{Action: "Openack"}
				ackMessageJSON, err := json.Marshal(ackMessage)
				if err != nil {
					log.Println("Error marshalling JSON:", err)
					return
				}
				err = conn.WriteMessage(websocket.TextMessage, ackMessageJSON)
				if err != nil {
					log.Println("Error writing message:", err)
				}
			}
		}
		if msg.Action == "closeFuelTank" {
			fmt.Println("Received action to close fuel tank")
			if closeFuelTank() == 0 {
				fmt.Println("Sending message to acknowledge that close is successful")
				ackMessage := Message{Action: "Closeack"}
				ackMessageJSON, err := json.Marshal(ackMessage)
				if err != nil {
					log.Println("Error marshalling JSON:", err)
					return
				}
				err = conn.WriteMessage(websocket.TextMessage, ackMessageJSON)
				if err != nil {
					log.Println("Error writing message:", err)
				}
			}
		}
	}
}

func openFuelTank() uint8 {
	fmt.Println("Opening fuel tank")
	sm.Transition(EventOpen)

	// Simulate opening the fuel tank
	time.Sleep(10 * time.Second)

	fmt.Println("Fuel tank opened successfully")
	sm.Transition(EventOpened)

	return 0
}

func closeFuelTank() uint8 {
	fmt.Println("Closing fuel tank")
	sm.Transition(EventClose)

	// Simulate closing the fuel tank
	time.Sleep(10 * time.Second)

	fmt.Println("Fuel tank closed successfully")
	sm.Transition(EventClosed)

	return 0
}

func main() {
	http.HandleFunc("/", handleWebSocket)
	log.Println("WebSocket server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
