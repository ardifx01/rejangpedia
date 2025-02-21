export default function PostShortcut({ post }: any) {
  return (
    <>
      <li key={post._id} className="mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center">
          {post.Image && (
            <img
              className="listing-image mb-3 mb-md-0 mr-md-3"
              style={{
                width: "160px",
                height: "110px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
              src={post.Image}
              alt={post.Title}
            />
          )}
          <div className={!post.Image ? "" : "ml-md-3"}>
            <a className="text-decoration-none" href={`/details/${post.id}`}>
              <h5 className="mb-2">{post.Title}</h5>
              {post.Content && (
                <p className="text-muted">
                  {
                    typeof post.Content === "string"
                      ? post.Content.replace(/<[^>]+>/g, "").substring(0, 100) // Jika Content adalah string
                      : post.Content[0]?.babContent
                          ?.replace(/<[^>]+>/g, "")
                          .substring(0, 100) // Jika Content adalah list dengan babContent
                  }
                  ...
                </p>
              )}
            </a>
          </div>
        </div>
      </li>
    </>
  );
}
