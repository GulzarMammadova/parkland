export function TestimonialCard({ data }) {
  return (
    <div className="rl-testimonial">
      <p>{data.text}</p>
      <div className="rl-testimonial-footer">
        <strong>{data.company}</strong>
      </div>
    </div>
  );
}