import "./LoginBox.css";

export default function Loginbox({ setEmail }){
    function login(){
        setEmail("Silas_Silva@bol.com.br");
    }
    return <>
    <div>
        <input></input>
        <button onClick={login}>Login</button>
    </div>
    </>
}