import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import PapersDisplay from "./PapersDisplay";
import moment from "moment";
import DateInput from "./DateInput";
import Abstracts from "./Abstracts";
import * as FileSaver from "file-saver";
import * as xlsx from "xlsx";
import Spinner from "./Spinner";
import WelcomeBanner from "./WelcomeBanner";
import { Routes, Route } from "react-router-dom";

class App extends Component {
  state = {
    idlist: [],
    idlistInputedDate: [],
    papersList: [],
    papersListInputedDate: [],
    abstracts: [],
    dateMinus30: moment().subtract("30", "days").format("YYYY/MM/DD"),
    inputedDate1: "",
    inputedDate2: "",
    loading: false,
    institute: "LIMS",
  };

  componentDidMount() {
    this.setState({ loading: true });

    const urlunencoded = `((La Trobe Institute for Molecular Science[Affiliation]) AND ("`;
    this.setState({ urlunencoded });

    const dateParams = `${this.state.dateMinus30}"[Date - Entrez] : "3000"[Date - Entrez])`;

    const urlEncoded = encodeURIComponent(urlunencoded);
    const dateParamsEncoded = encodeURIComponent(dateParams);
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`;

    axios.get(url).then((response) => {
      this.setState(
        { idlist: response.data.esearchresult.idlist, loading: false },
        () => {
          this.addPapers(this.state.idlist);
        }
      );
    });
  }

  selectInstitute = (newInstitute) => {
    this.setState({ loading: true, institute: newInstitute });
    let urlunencoded;
    if (newInstitute === "LIMS") {
      urlunencoded = `((La Trobe Institute for Molecular Science[Affiliation]) AND ("`;
    } else if (newInstitute === "LTU") {
      urlunencoded = `((La Trobe University[Affiliation]) AND ("`;
    } else if (newInstitute === "SABE") {
      urlunencoded = `((Agriculture, Biomedicine and Environment[Affiliation]) AND ("`;
    }

    this.setState({ urlunencoded }, () => this.selectInstituteGetPapers());
  };

  selectInstituteGetPapers = () => {
    if (!this.state.inputedDate1) {
      const dateParams = `${this.state.dateMinus30}"[Date - Entrez] : "3000"[Date - Entrez])`;

      const urlEncoded = encodeURIComponent(this.state.urlunencoded);
      const dateParamsEncoded = encodeURIComponent(dateParams);
      const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`;

      axios.get(url).then((response) => {
        this.setState(
          { idlist: response.data.esearchresult.idlist, loading: false },
          () => {
            this.addPapers(this.state.idlist);
          }
        );
      });
    } else {
      this.dateInput(this.state.inputedDate1, this.state.inputedDate2);
    }
  };

  addPapers = (idlist) => {
    this.setState({ loading: true });
    if (idlist) {
      let paperListString = idlist.toString();
      let paperList = [];

      axios
        .get(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=${paperListString}&api_key=9476810b14695bd14f228e63433facbf9c08`
        )
        .then((response) => {
          this.setState({ loading: false });
          idlist.forEach((id) => {
            let paperObj = {};
            let title = response.data.result[id].title;
            let journal = response.data.result[id].fulljournalname;
            let doi = response.data.result[id].elocationid;
            let authors = response.data.result[id].authors;
            let volume = response.data.result[id].volume;
            let pages = response.data.result[id].pages;
            let pubdate = response.data.result[id].pubdate;
            let authorList = [];
            authors.map((author, idx) =>
              idx > 0
                ? authorList.push(" " + author.name)
                : authorList.push(author.name)
            );
            paperObj.id = id;
            paperObj.title = title;
            paperObj.journal = journal;
            paperObj.authors = authorList.toString();
            paperObj.doi = doi;
            paperObj.volume = volume;
            paperObj.pages = pages;
            paperObj.pubdate = pubdate;
            paperList.push(paperObj);
          });
        })
        .then((result) => {
          paperList.length === this.state.idlist.length &&
            this.setState({ papersList: paperList });
        })
        .then((results) => {
          this.state.papersList.length === this.state.idlist.length &&
            this.addAbstracts(this.state.idlist);
        });
    }
  };

  addPapersInputedDate = (idlist) => {
    this.setState({ loading: true });
    if (idlist) {
      let paperListString = idlist.toString();
      let paperList = [];

      axios
        .get(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=${paperListString}&api_key=9476810b14695bd14f228e63433facbf9c08`
        )
        .then((response) => {
          this.setState({ loading: false });
          idlist.forEach((id) => {
            let paperObj = {};
            let title = response.data.result[id].title;
            let journal = response.data.result[id].fulljournalname;
            let doi = response.data.result[id].elocationid;
            let authors = response.data.result[id].authors;
            let volume = response.data.result[id].volume;
            let pages = response.data.result[id].pages;
            let pubdate = response.data.result[id].pubdate;
            let authorList = [];
            authors.map((author, idx) =>
              idx > 0
                ? authorList.push(" " + author.name)
                : authorList.push(author.name)
            );
            paperObj.id = id;
            paperObj.title = title;
            paperObj.journal = journal;
            paperObj.authors = authorList.toString();
            paperObj.volume = volume;
            paperObj.pages = pages;
            paperObj.pubdate = pubdate;
            paperObj.doi = doi;
            paperList.push(paperObj);
          });
        })
        .then((result) => {
          paperList.length === this.state.idlistInputedDate.length &&
            this.setState({ papersListInputedDate: paperList });
        })
        .then((results) => {
          this.state.papersListInputedDate.length ===
            this.state.idlistInputedDate.length &&
            this.addAbstracts(this.state.idlistInputedDate);
        });
    }
  };

  addAbstracts = (idlist) => {
    let abstractList = [];

    let abstractObj = {};
    let idlistString = idlist.toString();
    axios
      .get(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id=${idlistString}&api_key=9476810b14695bd14f228e63433facbf9c08`
      )
      .then((response3) => {
        abstractObj.abstract = response3.data;
        abstractList.push(abstractObj);
      })
      .then((results) => {
        this.setState({ abstracts: abstractList });
      });
  };

  dateInput = (date1, date2) => {
    this.setState({ inputedDate1: date1, inputedDate2: date2 });

    const convertedDate1 = moment(date1, "YYYY-MM-DD").format("YYYY/MM/DD");
    let convertedDate2 = "";
    if (date2) {
      convertedDate2 = moment(date2, "YYYY-MM-DD").format("YYYY/MM/DD");
    }

    const dateParams = `${convertedDate1}"[Date - Entrez] : "3000"[Date - Entrez])`;
    const dateParams2 = `${convertedDate1}"[Date - Entrez] : "${convertedDate2}"[Date - Entrez])`;
    const urlEncoded = encodeURIComponent(this.state.urlunencoded);
    const dateParamsEncoded = encodeURIComponent(dateParams);
    const dateParamsEncoded2 = encodeURIComponent(dateParams2);
    let url = "";
    if (date2) {
      url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded2}`;
    } else {
      url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`;
    }
    axios.get(url).then((response) =>
      this.setState(
        { idlistInputedDate: response.data.esearchresult.idlist },
        () => {
          this.addPapersInputedDate(this.state.idlistInputedDate);
        }
      )
    );
  };

  prepareData = () => {
    const workBook = xlsx.utils.book_new();
    const reportPapersSheetCols = [
      "Title",
      "Journal",
      "Volume",
      "Pages",
      "Authors",
      "PMID",
      "doi",
    ];

    const reportPapersData = this.state.papersList.map((paper) => [
      paper.title,
      paper.journal,
      paper.volume,
      paper.pages,
      paper.authors,
      paper.id,
      paper.doi,
    ]);

    const reportPapersWorkSheetData = [
      reportPapersSheetCols,
      ...reportPapersData,
    ];
    const reportPapersWorkSheet = xlsx.utils.aoa_to_sheet(
      reportPapersWorkSheetData
    );

    xlsx.utils.book_append_sheet(
      workBook,
      reportPapersWorkSheet,
      `${this.state.institute} - Last 30 days`
    );

    if (this.state.papersListInputedDate.length) {
      const reportPapersData = this.state.papersListInputedDate.map((paper) => [
        paper.title,
        paper.journal,
        paper.volume,
        paper.pages,
        paper.authors,
        paper.id,
        paper.doi,
      ]);

      const reportPapersWorkSheetData = [
        reportPapersSheetCols,
        ...reportPapersData,
      ];
      const reportPapersWorkSheet = xlsx.utils.aoa_to_sheet(
        reportPapersWorkSheetData
      );

      let date2;
      if (!this.state.inputedDate2) {
        date2 = "today";
      } else {
        date2 = moment(this.state.inputedDate2, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );
      }

      xlsx.utils.book_append_sheet(
        workBook,
        reportPapersWorkSheet,
        `${this.state.institute} - ${moment(
          this.state.inputedDate1,
          "YYYY-MM-DD"
        ).format("DD-MM-YYYY")} to ${date2}`
      );
    }

    this.createSheet(workBook);
  };

  createSheet = (workBook) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    workBook.Props = { Title: "Report" };
    const excelBuffer = xlsx.write(workBook, {
      bookType: "xlsx",
      type: "array",
    });
    const blobData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blobData, "Wordcloud wordlist" + fileExtension);
  };

  render() {
    let papersDisplay = "";
    let abstracts = "";

    papersDisplay = (
      <PapersDisplay
        papersList={this.state.papersList}
        papersListWeek={this.state.papersListWeek}
        papersListInputedDate={this.state.papersListInputedDate}
        inputedDate1={this.state.inputedDate1}
        inputedDate2={this.state.inputedDate2}
        institute={this.state.institute}
        selectInstitute={this.selectInstitute}
        prepareData={this.prepareData}
      />
    );

    abstracts = (
      <Abstracts abstracts={this.state.abstracts} idlist={this.state.idlist} />
    );

    if (this.state.loading) {
      papersDisplay = <Spinner />;
      abstracts = <Spinner />;
    }

    return (
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <WelcomeBanner />
                <DateInput dateInput={this.dateInput} />
                {papersDisplay}
              </>
            }
          />
          <Route exact path="/abstracts" element={abstracts} />
        </Routes>
      </div>
    );
  }
}
export default App;
