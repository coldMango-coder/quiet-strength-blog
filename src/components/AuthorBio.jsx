import React from "react";
import Avatar from "./Avatar";

export default function AuthorBio() {
  const authorImageSrc = "/images/marica-sinko-author-photo.webp?v=1762037948136";
  return (
    <section className="article-author fancy responsive" aria-labelledby="author-name">
      <Avatar
        src={authorImageSrc}
        alt={"Marica \\u0160inko"}
        size={160}
        className="author-avatar"
      />
      <div className="bio">
        <h3 id="author-name" className="name">{"Marica \u0160inko"}</h3>
        <p className="role">Founder of Quiet Strength</p>
        <p className="copy">
          I am an introvert-women burnout coach dedicated to helping
          introverted women build quiet confidence without burnout.
        </p>
        <a className="bio-link" href="/#about">See full bio</a>
      </div>
    </section>
  );
}

