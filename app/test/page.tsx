import { styled } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import styles from '../Styling/ChatComponent.module.css'
const test = () => {
    const dummyText = "1. Item One\n2. Item Two\n\n- Bullet One\n- Bullet Two";

    return (
        <div className={styles.markdownContent}>
            <ReactMarkdown>
                {dummyText}
            </ReactMarkdown>
        </div>
    );
}

export default test;
