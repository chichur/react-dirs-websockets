import styles from './index.module.css';
import { useState } from "react";
import Dir from "../Dir";
import File from "../File";

const DirTree = ({
    ...rest
}) => {

    const [dirs, setDirs] = useState([]);
    const [path, setPath] = useState("")

    async function loadDirs() {
        try {
            const response = await fetch('http://localhost:3005/dirs');
            if (!response.ok)
                throw new Error(response.statusText);
            const json = await response.json();
            setDirs(json.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function getPath(id) {
        try {
            const response = await fetch(`http://localhost:3005/file/${id}`);
            if (!response.ok)
                throw new Error(response.statusText);
            const json = await response.json();
            setPath(json.data);
        } catch (e) {
            console.error(e);
        }
    }

    const renderNode = (node) => {
        if (node) {
            if (node.file)
                return <File handlerClick={() => getPath(node.id)} name={node.name} key={node.id} />
            else return (
                <Dir name={node.name}
                     key={node.id}>
                    {node.childrens.map(value => renderNode(value))}
                </Dir>
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
        treeView = tree.childrens.map(value => renderNode(value));
    }
    return(
        <div className={styles.dir}>
            <a href="#" onClick={loadDirs}>{path !== "" ? path : "Выбрать"}</a>
            {treeView}
        </div>
    );
}

export default DirTree;