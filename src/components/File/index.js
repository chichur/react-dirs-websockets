import styles from './index.module.css';
import {useEffect, useState} from "react";

const File = ({
    handlerClick, name, ...rest
}) => {
    const [color, setColor] = useState('#bdbdbd')

    useEffect(() => {
        // при монтировании компонента подключаемся к сокету
        let socket = new WebSocket("ws://localhost:8081");

        socket.onmessage = function(event) {
            let message = event.data;
            setColor(message);
        };

        return () => {
            // при демонтировании отключаемся.
            socket.close();
        }
    }, [])

    return(
        <div onClick={handlerClick} className={styles.file} style={{ background: color }}>
            <p>{name}</p>
        </div>
    );
}

export default File;