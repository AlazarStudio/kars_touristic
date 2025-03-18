export default function ContainerLeft({ children, ...props }) {
  return (
    <>
      <div className={classes.containerLeft}>
        <a href="/" target="_blank" className={classes.containerLeftA}>
          <img
            src="/about_title_logo.webp"
            alt=""
            className={classes.containerLeftLogo}
          />
        </a>
        <div className={classes.containerLeftMenu}>
          {dynamicSections.map((section) => (
            <div key={section.title} className={classes.containerLeftSection}>
              <div
                className={classes.sectionHeader}
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                {openSections[section.title] ? <ExpandLess /> : <ExpandMore />}
              </div>
              {openSections[section.title] && (
                <div className={classes.sectionContent}>
                  {section.items.map((item) =>
                    typeof item === 'string' ? (
                      <div
                        key={item}
                        className={classes.sectionItem}
                        onClick={() => setSelectedSection(item)}
                      >
                        {item}
                      </div>
                    ) : (
                      <div key={item.title} className={classes.subSection}>
                        <div
                          className={classes.subSectionHeader}
                          onClick={() => toggleSubSection(item.title)}
                        >
                          {item.title}
                          {openSubSections[item.title] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </div>
                        {openSubSections[item.title] && (
                          <div className={classes.subSectionContent}>
                            {item.subItems.map((subItem) => (
                              <div
                                key={subItem}
                                className={classes.subSectionItem}
                                onClick={() => setSelectedSection(subItem)}
                              >
                                {subItem}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <a href="/" className={classes.containerLeftBottom}>
          <img src="/Subtract.png" />
          Пререйти на сайт
        </a>
      </div>
    </>
  );
}
