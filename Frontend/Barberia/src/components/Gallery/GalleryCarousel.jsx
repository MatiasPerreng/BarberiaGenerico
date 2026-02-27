import "./GalleryCarousel.css";
import rasuradoImg from "../../pages/Public/Gallery/rasurado-carousel.jpg";
import rasuradoImg2 from "../../pages/Public/Gallery/rasurado-carousel2.jpg";
import platinado from "../../pages/Public/Gallery/platinado-carousel.jpg";

export default function GalleryCarousel() {
  return (
    <section className="gallery-section py-5">
      <div className="container">

        {/* TÍTULO MEJORADO */}
        <div className="gallery-title-wrapper">
          <h2 className="gallery-title">
            <span>Nuestros</span> trabajos
          </h2>
          <div className="gallery-title-line" />
        </div>

        <div
          id="galleryCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">

            <div className="carousel-item active">
              <img
                src={rasuradoImg}
                className="d-block w-100 gallery-img"
                alt="Corte 1"
              />
            </div>

            <div className="carousel-item">
              <img
                src={rasuradoImg2}
                className="d-block w-100 gallery-img"
                alt="Corte 2"
              />
            </div>

            <div className="carousel-item">
              <img
                src={platinado}
                className="d-block w-100 gallery-img"
                alt="Corte 3"
              />
            </div>

          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#galleryCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#galleryCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
