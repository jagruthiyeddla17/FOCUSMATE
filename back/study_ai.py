# study_ai.py — STATIC IOT STUDY ASSISTANT (REVIEW SAFE)

def answer_question_from_document(question: str):
    q = question.lower()

    qa = {
        "what is iot": 
        "The Internet of Things (IoT) refers to a network of physical objects such as sensors, devices, and machines that are connected to the internet to collect and exchange data without human intervention.",

        "iot architecture":
        "IoT architecture consists of four layers: the perception layer (sensors and devices), transport layer (data transmission), processing layer (cloud and data analytics), and application layer (user-facing services).",

        "applications of iot":
        "IoT is widely used in smart homes, healthcare monitoring, industrial automation, smart agriculture, smart cities, and transportation systems.",

        "advantages of iot":
        "The advantages of IoT include automation, real-time monitoring, improved efficiency, reduced human effort, better decision-making, and cost savings.",

        "disadvantages of iot":
        "IoT systems face challenges such as security risks, privacy concerns, high initial cost, data management complexity, and dependency on internet connectivity.",

        "iot protocols":
        "Common IoT communication protocols include MQTT, CoAP, HTTP, AMQP, and ZigBee, each designed for lightweight and reliable data transmission.",

        "iot security":
        "IoT security focuses on protecting devices and networks from threats using authentication, encryption, secure firmware updates, and access control mechanisms.",

        "iot sensors":
        "IoT sensors are devices that collect physical data such as temperature, humidity, motion, pressure, and light, converting it into digital signals.",

        "difference between iot and iot devices":
        "IoT refers to the entire ecosystem of connected devices and data exchange, while IoT devices are the physical components within that ecosystem.",

        "future of iot":
        "The future of IoT includes AI integration, edge computing, smart cities, autonomous systems, and large-scale industrial IoT deployments."
    }

    for key in qa:
        if key in q:
            return qa[key]

    return (
        "IoT is a system of interconnected smart devices that communicate over the internet. "
        "It enables automation, monitoring, and intelligent decision-making across various domains."
    )
