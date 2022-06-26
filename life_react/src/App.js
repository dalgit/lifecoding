import './App.css';
import { useState } from 'react';

function Header(props) {
  return <h1><a href="/" onClick={function (event) {
    event.preventDefault();
    props.onchangeMode();
  }}>{props.title}</a></h1>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={function (event) {
      event.preventDefault();

      //event.target = <form>~</form>
      //event.target.title = <input type="text" name="title" placeholder="title적어">
      //event.target.title.value = ㄴㄴㅉㅁㅇㅇ
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title적어"></input></p>
      <p><textarea name="body" placeholder='body적어'></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>

}
function Nav(props) {
  const lis = []
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    //event.target : http://localhost:3000/read2
    //event.target.id : 2
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read' + t.id} onClick={function (event) {
        event.preventDefault();
        //app의 onchangemode를 통해 여기로 오고 여길 통해 id를 설정해줌
        props.onchangeMode(Number(event.target.id));
      }}
      >{t.title}</a></li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return <article><h2>{props.title}</h2>
    {props.body}</article>
}

//onchange: 리액트에선 값을 입력할 때 마다 호출됨
//키보드 입력때마다 컴퍼넌트 다시 랜더링 됨
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={function (event) {
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
  }}>
    <p><input type="text" name="title" placeholder="title" value={title}
    onChange={function(event){
      setTitle(event.target.value);
    }}></input></p>
    <p><textarea name="body" placeholder='body' value={body} 
    onChange={function(event){
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type="submit" value="Update"></input></p>
  </form>
</article>
}




function App() {
  //밑에 return에서 id값이 바뀌면 다시 시작하면서 새로 id값이 지정됨
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextid] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' },
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ]);

  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <li><a href={"/update"+id} onClick={function(event){
      event.preventDefault();
      setMode('UPDATE');
    }}
    >update</a></li>

  } else if (mode === 'CREATE') {
    content = <Create onCreate={function (_title, _body) {
      const newTopic = { id: nextId, title: _title, body: _body }
      //객체는 바로 set하지 못한다. 일단
      //1. 복사본 만들어야. 바깥쪽이 배열이니 [...topics]
      const newTopics = [...topics]
      //2. 그 복제본에 set할것을 넣는다.
      newTopics.push(newTopic);
      //3. 이제 set으로 복제본에 추가한것을 전달한다.
      setTopics(newTopics);
      //4. 그럼 오리지널 topics와 새로 들어온 topics(newTopics)가
      //다르다면 그때 컴퍼넌트를 다시 랜더링해준다.

      setMode('READ');
      setId(nextId);
      setNextid(nextId + 1);

    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body}
    onUpdate={function(title,body){
      //업데이트: READ상태에서만 실행된다. 
      //READ는 자연스럽게 id가 세팅되어 있을 것. 따라서 사용가능.
      const newTopics= [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for (let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }


  return (
    <div>
      <Header title="WEB" onchangeMode={function () {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onchangeMode={function (_id) {
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={function (event) {
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
          {contextControl}
        </li>
      </ul>
    </div>
  );
}
export default App;