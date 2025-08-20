import styles from "./footer.module.css"

const Footer =({darkMode})=>{
    
    return(
        <div className={`${styles.footer} ${darkMode ? styles.dark : ''}`}>
            <p className={styles.text} >© 2025 Crypto Tracker. All rights reserved.</p>
            <br/><p className={styles.text}>Created by <a className={styles.link} href="https://github.com/leMichall" target="_blank" rel="noopener noreferrer">Michał Leszczyk</a></p>
        </div>
    )
}
export default Footer;