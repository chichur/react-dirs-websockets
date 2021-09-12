import styles from './index.module.css';
import {useEffect, useState} from "react";

const DirTree = ({
    ...rest
}) => {
    const socket = new WebSocket("ws://localhost:8081");

    const [dirs, setDirs] = useState([])

    useEffect(() => {
        socket.onmessage = function(event) {
            const incomingMessage = event.data;
            console.log(JSON.parse(incomingMessage))
            setDirs(JSON.parse(incomingMessage));
        };
    }, [])

    const onSelectDir = (node) => {
        socket.send(node)
    }

    const renderNode = (node) => {
        if (node) {
            return (
                <li onMouseEnter={() => onSelectDir(node.name)}>
                    {node.name}
                    <ul>
                        {node.childrens.map(value => renderNode(value))}
                    </ul>
                </li>
            );
        }
        else return null;
    }

    function rec(cur) {
        let childrens = [];
        for (let child of dirs) {
            if (child.parent === cur.id) childrens.push(child);
        }
        cur["childrens"] = childrens;
        for (let child of childrens) rec(child);
    }

    let treeView = '';
    if (dirs.length) {
        let tree = dirs[0];
        rec(tree);
        treeView = tree.childrens.map(value => renderNode(value));;
    }
    return(
        <div className={styles.dir}>
            <a href="#" onClick={() => socket.send('req_dirs')}>Выбрать</a>
            <ul>
                {treeView}
            </ul>
        </div>
    );
}

export default DirTree;