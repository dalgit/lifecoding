import './App.css';

//state 사용하기위해
import {useState} from 'react';


//컴퍼넌트(사용자 정의 태그)만들기. 반드시 첫대문자
//event객체가 제어해줌. preventDefault를 써서 클릭시 리로드 안되게
// => arrow 펑션

function Header(props) {
  return <header>
    <h1><a href="/" onClick={function(event){
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={function(event){
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

//form태그: https://ofcourse.kr/html-course/form-%ED%83%9C%EA%B7%B8
//textarea: https://www.codingfactory.net/11611
//onsubmit: submit 클릭했을때 from태그에서 발생하는 이벤트
//event target:은 이벤트가 발생한 태그를 가르킨다
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={function(event){
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title 입력"></input></p>
      <p><textarea name="body" placeholder="body 입력"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}








function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

// usestate의 인자는 초기값
// 스테이트값은 mode[0]로 읽음 
// 바꿀땐 mose[1] 함수로 바꿈
function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // 이것은 한 줄로 쓰면
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is'},
    {id:2, title:'css', body:'css is'},
    {id:3, title:'javascript', body:'javascript is'}
  ])
  let content = null;
  if (mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content =<Article title={title} body={body}></Article>
  } else if(mode === 'CREATE'){
    content =<Create onCreate={function(_title, _body){
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }

  //모드의 값이 바뀔경우 app컴퍼넌트가 다시 실행됨
  return (
    <div>
      <Header title="WEB" 
      onChangeMode={()=>{setMode('WELCOME');}}>
      </Header>
      <Nav topics={topics}
      onChangeMode={function(_id){
        setMode('READ');
        setId(_id);     
      }}>   
      </Nav>
      {content}
      <a href="/create" onClick={function(event){
        event.preventDefault();
        setMode('CREATE');
      }}>Create</a>
    </div>
  );
}

export default App;
