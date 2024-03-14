<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/swellander/repo-gate">
    <img src="https://github.com/swellander/repo-gate/assets/22231097/1669e995-30a9-4403-9c24-0961672e1518" alt="Logo" width="200" height="200">
  </a>

  <p align="center">
    <a href="https://github.com/swellander/repo-gate/issues">Report Bug</a>
    <a href="https://github.com/swellander/repo-gate/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About Repo Gate

When a repo admin installs Repo Gate as a Github App on their repo, the bot will immediately add a custom link to the project Readme. When a prospective user visits the repo, they can click the `Get Collab Invite` link and be prompted to sign a message, proving they own some [SPORK Token](https://polygonscan.com/token/0x9ca6a77c8b38159fd2da9bd25bc3e259c33f5e39). If the user does own the token, they will be automatically invited as a collaborator with `write` access to the repo.

### Built With

- [![Scaffold Eth 2][Scaffold-Eth-2]][SE2-url]
- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]

## Installation

To use the Repo Gate app, it will need to installed as a GitHub App on all the repositories you wish to gate.

[Install Github app](https://github.com/apps/repo-gate)

## Usage

After installing the app on a repo, a commit will automatically be made to the repo's `README.md` (creating one if it doesn't already exist), adding a link to the bottom of the file for users to click to be added as a collaborator. The appearance of the link can be customized as long as the actual url doesn't change.

## Roadmap

- [x] Handle SPORK Token
- [ ] Make token address configurable
- [ ] Make collaborator permissions configurable
- [ ] Clean up UI
- [ ] Add support for ERC-721
- [ ] Add support for ERC-1155
- [ ] Keep collaborator access in sync with token balance
- [ ] Refactor to get `repo` and `owner` from `installation_id`

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

Sam Wellander - [@websurfer.eth](https://warpcast.com/websurfer.eth)

## Acknowledgments

Many thanks to [the Buidl Guidl](https://buidlguidl.com/) and the amazing [Scaffold-Eth-2](https://github.com/scaffold-eth/scaffold-eth-2) template that forms the base of this repo!

[contributors-shield]: https://img.shields.io/github/contributors/swellander/repo-gate.svg?style=for-the-badge
[contributors-url]: https://github.com/swellander/repo-gate/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/swellander/repo-gate.svg?style=for-the-badge
[forks-url]: https://github.com/swellander/repo-gate/network/members
[stars-shield]: https://img.shields.io/github/stars/swellander/repo-gate.svg?style=for-the-badge
[stars-url]: https://github.com/swellander/repo-gate/stargazers
[issues-shield]: https://img.shields.io/github/issues/swellander/repo-gate.svg?style=for-the-badge
[issues-url]: https://github.com/swellander/repo-gate/issues
[license-shield]: https://img.shields.io/github/license/swellander/repo-gate.svg?style=for-the-badge
[license-url]: https://github.com/swellander/repo-gate/blob/master/LICENSE.txt
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss
[TailwindCSS-url]: https://tailwindcss.com/
[Scaffold-Eth-2]: https://img.shields.io/badge/SE2-v.0.0.34-2
[SE2-url]: https://github.com/scaffold-eth/scaffold-eth-2
