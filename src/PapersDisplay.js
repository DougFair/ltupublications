import React from "react";
import moment from "moment";
import LinkButton from "./LinkButton";
import DownloadButton from "./DownloadButton";
import Dropdown from "./Dropdown";
import "./PaperDisplay.css";

const PapersDisplay = (props) => {
  const handleInstitute = (institute) => {
    props.selectInstitute(institute);
  };

  if (
    (props.inputedDate1 || props.inputedDate2) &&
    !props.papersListInputedDate.length
  ) {
    return (
      <div>
        {!props.inputedDate2 ? (
          <div className="paperDisplayHeadSection">
            <Dropdown
              institute={props.institute}
              handleInstitute={handleInstitute}
            />
            <h2 className="paperDisplayHeading">
              {`No ${props.institute} papers published since
              ${moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}`}
            </h2>
          </div>
        ) : (
          <div className="paperDisplayHeadSection">
            <Dropdown
              institute={props.institute}
              handleInstitute={handleInstitute}
            />
            <h2 className="paperDisplayHeading">
              {`No ${props.institute} papers published between
              ${moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")} -
              ${moment(props.inputedDate2, "YYYY-MM-DD").format("DD/MM/YYYY")}`}
            </h2>
          </div>
        )}
      </div>
    );
  }
  if (props.papersListInputedDate.length) {
    const inputedDate = props.papersListInputedDate.map((data) => {
      let volume = "";
      if (data.volume === "") {
        volume = " volume/pages not yet available";
      } else {
        volume = `${data.volume}: `;
      }

      return (
        <div className="paperlistContainer" key={data.id}>
          <span>
            <span className="title">{`${data.title} `}</span>
            <span className="authors">{`${data.authors}, `}</span>
            <span className="journal">{`${data.journal}  `}</span>
            <span className="volume">{`${volume} `}</span>
            <span className="pages">{`${data.pages},  `}</span>
            <span className="pubdate">
              Publication date: {`${data.pubdate},  `}
            </span>
            <span className="doi">{`${data.doi}, `}</span>
            <span className="pmid">
              PMID:{" "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/pubmed/${data.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.id}.
              </a>
            </span>
          </span>
        </div>
      );
    });
    return (
      <div className="paperDisplay">
        <Dropdown
          institute={props.institute}
          handleInstitute={handleInstitute}
        />
        {!props.inputedDate2 ? (
          <div className="paperDisplayHeadSection">
            <h2 className="paperDisplayHeading">
              {`${props.institute} papers published since
              ${moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}`}
            </h2>
            <p className="paperDisplayHeadingNumbers">
              {`(${props.papersListInputedDate.length} papers)`}
            </p>
            <div className="actionButtons">
              {/* <LinkButton to="/abstracts">Retrieve Abstracts</LinkButton> */}
              <DownloadButton prepareData={props.prepareData} />
            </div>
          </div>
        ) : (
          <div className="paperDisplayHeadSection">
            <h2 className="paperDisplayHeading">
              {`${props.institute} papers published between
            ${moment(props.inputedDate1, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            )} - ${moment(props.inputedDate2, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )}`}
            </h2>
            <p className="paperDisplayHeadingNumbers">
              {`(${props.papersListInputedDate.length} papers)`}
            </p>
            <div className="actionButtons">
              {/* <LinkButton to="/abstracts">Retrieve Abstracts</LinkButton> */}
              <DownloadButton prepareData={props.prepareData} />
            </div>
          </div>
        )}
        {inputedDate}
      </div>
    );
  } else {
    const month = props.papersList.map((data) => {
      let volume = "";
      if (data.volume === "") {
        volume = " volume/pages not yet available";
      } else {
        volume = `${data.volume}: `;
      }

      return (
        <div className="paperlistContainer" key={data.id}>
          <span>
            <span className="title">{`${data.title} `}</span>
            <span className="authors">{`${data.authors}, `}</span>
            <span className="journal">{`${data.journal}  `}</span>
            <span className="volume">{`${volume} `}</span>
            <span className="pages">{`${data.pages},  `}</span>
            <span className="pubdate">
              Publication date: {`${data.pubdate},  `}
            </span>
            <span className="doi">{`${data.doi}, `}</span>
            <span className="pmid">
              PMID:{" "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/pubmed/${data.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.id}.
              </a>
            </span>
          </span>
        </div>
      );
    });

    return (
      <div className="paperDisplay">
        <Dropdown
          institute={props.institute}
          handleInstitute={handleInstitute}
        />
        <div className="paperDisplayHeadSection">
          <h2 className="paperDisplayHeading">
            {`${props.institute} papers published in the last 30 days`}
          </h2>
          <p className="paperDisplayHeadingNumbers">
            {props.papersList.length
              ? `(${props.papersList.length} papers)`
              : null}
          </p>
        </div>
        <div className="actionButtons">
          {/* <LinkButton to="/abstracts">Retrieve Abstracts</LinkButton> */}
          <DownloadButton prepareData={props.prepareData} />
        </div>
        {!props.papersList.length ? (
          <p>
            {`There were no ${props.institute} papers published yesterday in the last 30 days.`}
          </p>
        ) : (
          month
        )}
      </div>
    );
  }
};

export default PapersDisplay;
