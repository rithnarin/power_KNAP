import React from 'react';

const Home = (props) => (
  <main role="main">
    <div className="starter-template">
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Fam.ly</h1>
          <p>Join people and watch videos together as a Fam.ly !</p>
          <p>
            <button className="btn btn-sm btn-secondary" onClick={props.openModal}>Select Room</button>
          </p>
        </div>
      </section>
    </div>
  </main>
);

export default Home;
