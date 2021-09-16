import styles from './index.module.css';
import {useState} from "react";
import File from "../File";

const Dir = ({
    name, children, ...rest
}) => {
    const [expand, setExpand] = useState(false);

    const onEnter = () => {

                setExpand(true)
    }

    const onLeave = () => {
            setExpand(false)
    }

    return(
        <div className={styles.dir} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <p>{name}</p>
            {expand ?
                <div className={styles.dirExpand}>
                    {children}
                </div>
                 : ''}
        </div>
    );
}

export default Dir;