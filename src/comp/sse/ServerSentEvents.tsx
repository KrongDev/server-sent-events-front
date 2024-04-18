import {useEffect, useState} from "react";
import axios from "axios";


export const ServerSentEvents = () => {
    const [requestId, setRequestId] = useState("");
    const defaultURL = "/api/sse";
    const onClickSubscribe = async () => {
        const res = await axios.get(defaultURL + "/request-id");
        setRequestId(res.data)
    }

    const [resource, setResource] = useState<{ id: string, message: string }[]>([]);

    const handleEventMessage = (event: MessageEvent) => {
        console.log(event.lastEventId, event.data);
        setResource((r)=>[...r, {id: event.lastEventId,message: event.data}]);
    }

    const handleEventError = (event: MessageEvent) => {
        console.log(event.data);
    }

    useEffect(() => {
        let eventSource: EventSource;
        if (requestId.length) {
            eventSource = new EventSource(defaultURL + "/connect/" + requestId);
            eventSource.addEventListener("message", handleEventMessage)
            eventSource.addEventListener("error", handleEventError)
        }

        return (() => {
            if (requestId) {
                eventSource.addEventListener("message", handleEventMessage)
                eventSource.addEventListener("error", handleEventError)
            }
        })
    }, [requestId]);

    const onClickCreateEvent = async () => {
        await axios.post(defaultURL + "/action")
    }

    const onClickUpdateEvent = async () => {
        await axios.put(defaultURL + "/action")
    }

    const onClickDeleteEvent = async () => {
        await axios.delete(defaultURL + "/action")
    }

    return (
        <div>
            <div>
                <button onClick={onClickSubscribe}>connect</button>
            </div>
            <div>
                <button onClick={onClickCreateEvent}>create event</button>
                <button onClick={onClickUpdateEvent}>update event</button>
                <button onClick={onClickDeleteEvent}>delete event</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>id</td>
                            <td>message</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        resource.map(res => (
                            <tr>
                                <td>{res.id}</td>
                                <td>{res.message}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
